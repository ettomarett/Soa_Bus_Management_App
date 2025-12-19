package com.bustransport.ticket.service;

import com.bustransport.ticket.dto.request.ValidateTicketRequest;
import com.bustransport.ticket.dto.response.TicketResponse;
import com.bustransport.ticket.dto.response.TicketValidationResponse;
import com.bustransport.ticket.entity.Ticket;
import com.bustransport.ticket.enums.TicketStatus;
import com.bustransport.ticket.exception.InvalidTicketException;
import com.bustransport.ticket.exception.ResourceNotFoundException;
import com.bustransport.ticket.mapper.TicketMapper;
import com.bustransport.ticket.repository.TicketRepository;
import com.bustransport.ticket.util.QRCodeGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;
    private final QRCodeGenerator qrCodeGenerator;
    private final NotificationClient notificationClient;

    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        return ticketMapper.toResponse(ticket);
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicketByQrCode(String qrCode) {
        Ticket ticket = ticketRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with QR code: " + qrCode));
        return ticketMapper.toResponse(ticket);
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getTicketsByUserId(Long userId) {
        return ticketRepository.findByUserId(userId).stream()
                .map(ticketMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getActiveTicketsByUserId(Long userId) {
        return ticketRepository.findActiveTicketsByUserId(userId, LocalDateTime.now()).stream()
                .map(ticketMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TicketValidationResponse validateAndUseTicket(ValidateTicketRequest request) {
        Ticket ticket = ticketRepository.findByQrCode(request.getQrCode())
                .orElseThrow(() -> new InvalidTicketException("Invalid QR code"));

        Long passengerId = ticket.getUserId();
        Long controllerId = request.getControllerId();

        // Validate route
        if (!ticket.getRouteId().equals(request.getRouteId())) {
            // Send notification to passenger about invalid route
            notificationClient.sendNotification(
                    passengerId,
                    controllerId,
                    "Ticket Validation Failed",
                    "Your ticket was checked and found to be invalid for route " + request.getRouteId() + ".",
                    "TICKET_VALIDATION_FAILED",
                    "{\"ticketId\":" + ticket.getId() + ",\"routeId\":" + request.getRouteId() + "}"
            );
            
            return TicketValidationResponse.builder()
                    .valid(false)
                    .message("Ticket is not valid for this route")
                    .ticket(ticketMapper.toResponse(ticket))
                    .build();
        }

        // Validate schedule if provided
        if (request.getScheduleId() != null && ticket.getScheduleId() != null
                && !ticket.getScheduleId().equals(request.getScheduleId())) {
            // Send notification to passenger about invalid schedule
            notificationClient.sendNotification(
                    passengerId,
                    controllerId,
                    "Ticket Validation Failed",
                    "Your ticket was checked and found to be invalid for the selected schedule.",
                    "TICKET_VALIDATION_FAILED",
                    "{\"ticketId\":" + ticket.getId() + ",\"scheduleId\":" + request.getScheduleId() + "}"
            );
            
            return TicketValidationResponse.builder()
                    .valid(false)
                    .message("Ticket is not valid for this schedule")
                    .ticket(ticketMapper.toResponse(ticket))
                    .build();
        }

        // Check if ticket is valid
        if (!ticket.isValid()) {
            String message = getInvalidTicketMessage(ticket);

            // Special case: If ticket is USED or reached max usage, but time is still valid
            // allow it as "Already Validated" for inspection purposes
            boolean isTimeValid = !LocalDateTime.now().isAfter(ticket.getValidUntil());
            boolean isUsageInvalid = ticket.getStatus() == TicketStatus.USED
                    || ticket.getUsageCount() >= ticket.getMaxUsage();

            if (isTimeValid && isUsageInvalid) {
                // Send notification about already validated ticket
                notificationClient.sendNotification(
                        passengerId,
                        controllerId,
                        "Ticket Already Validated",
                        "Your ticket was checked and confirmed as already validated.",
                        "TICKET_VALIDATION_SUCCESS",
                        "{\"ticketId\":" + ticket.getId() + "}"
                );
                
                return TicketValidationResponse.builder()
                        .valid(true)
                        .message("Ticket already validated")
                        .ticket(ticketMapper.toResponse(ticket))
                        .build();
            }

            // Send notification about invalid ticket
            notificationClient.sendNotification(
                    passengerId,
                    controllerId,
                    "Ticket Validation Failed",
                    message,
                    "TICKET_VALIDATION_FAILED",
                    "{\"ticketId\":" + ticket.getId() + "}"
            );

            return TicketValidationResponse.builder()
                    .valid(false)
                    .message(message)
                    .ticket(ticketMapper.toResponse(ticket))
                    .build();
        }

        // Use the ticket
        ticket.use();
        ticketRepository.save(ticket);

        log.info("Ticket {} used successfully", ticket.getQrCode());

        // Send success notification to passenger
        notificationClient.sendNotification(
                passengerId,
                controllerId,
                "Ticket Validated Successfully",
                "Your ticket has been validated and used successfully on route " + request.getRouteId() + ".",
                "TICKET_VALIDATION_SUCCESS",
                "{\"ticketId\":" + ticket.getId() + ",\"routeId\":" + request.getRouteId() + "}"
        );

        return TicketValidationResponse.builder()
                .valid(true)
                .message("Ticket validated and used successfully")
                .ticket(ticketMapper.toResponse(ticket))
                .build();
    }

    @Transactional
    public TicketResponse cancelTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        if (!ticket.canBeCancelled()) {
            throw new InvalidTicketException(
                    "Ticket cannot be cancelled. It may have been used or cancellation period has expired");
        }

        ticket.cancel();
        ticketRepository.save(ticket);

        log.info("Ticket {} cancelled", ticket.getId());

        return ticketMapper.toResponse(ticket);
    }

    @Transactional
    public void expireOldTickets() {
        List<Ticket> expiredTickets = ticketRepository.findExpiredTickets(LocalDateTime.now());

        for (Ticket ticket : expiredTickets) {
            ticket.setStatus(TicketStatus.EXPIRED);
        }

        ticketRepository.saveAll(expiredTickets);
        log.info("Expired {} tickets", expiredTickets.size());
    }

    public String generateQRCodeImage(String qrCodeText) {
        return qrCodeGenerator.generateQRCodeImage(qrCodeText);
    }

    private String getInvalidTicketMessage(Ticket ticket) {
        if (ticket.getStatus() != TicketStatus.ACTIVE) {
            return "Ticket is " + ticket.getStatus().toString().toLowerCase();
        }
        if (LocalDateTime.now().isAfter(ticket.getValidUntil())) {
            return "Ticket has expired";
        }
        if (ticket.getUsageCount() >= ticket.getMaxUsage()) {
            return "Ticket has reached maximum usage limit";
        }
        return "Ticket is not valid";
    }
}
