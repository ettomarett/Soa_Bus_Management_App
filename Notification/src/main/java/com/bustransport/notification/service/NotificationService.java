package com.bustransport.notification.service;

import com.bustransport.notification.config.RabbitMQConfig;
import com.bustransport.notification.dto.CreateNotificationRequest;
import com.bustransport.notification.dto.NotificationRequest;
import com.bustransport.notification.dto.NotificationResponse;
import com.bustransport.notification.entity.Notification;
import com.bustransport.notification.entity.NotificationStatus;
import com.bustransport.notification.mapper.NotificationMapper;
import com.bustransport.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final RabbitTemplate rabbitTemplate;

    @Transactional
    public NotificationResponse createNotification(CreateNotificationRequest request) {
        log.info("Creating notification from sender {} to recipient {}", request.getSenderId(), request.getRecipientId());
        
        Notification notification = Notification.builder()
                .recipientId(request.getRecipientId())
                .senderId(request.getSenderId())
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType())
                .status(NotificationStatus.UNREAD)
                .metadata(request.getMetadata())
                .build();

        notification = notificationRepository.save(notification);
        log.info("Notification created with ID: {}", notification.getId());

        // Send email notification via RabbitMQ
        sendEmailNotification(notification);

        return notificationMapper.toResponse(notification);
    }

    public Page<NotificationResponse> getNotificationsByRecipient(Long recipientId, Pageable pageable) {
        log.info("Fetching notifications for recipient: {}", recipientId);
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId, pageable)
                .map(notificationMapper::toResponse);
    }

    public List<NotificationResponse> getUnreadNotifications(Long recipientId) {
        log.info("Fetching unread notifications for recipient: {}", recipientId);
        return notificationRepository.findByRecipientIdAndStatusOrderByCreatedAtDesc(recipientId, NotificationStatus.UNREAD)
                .stream()
                .map(notificationMapper::toResponse)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(Long recipientId) {
        return notificationRepository.countByRecipientIdAndStatus(recipientId, NotificationStatus.UNREAD);
    }

    @Transactional
    public NotificationResponse markAsRead(Long notificationId, Long userId) {
        log.info("Marking notification {} as read by user {}", notificationId, userId);
        
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getRecipientId().equals(userId)) {
            throw new RuntimeException("User is not authorized to mark this notification as read");
        }

        notification.setStatus(NotificationStatus.READ);
        notification.setReadAt(LocalDateTime.now());
        notification = notificationRepository.save(notification);

        return notificationMapper.toResponse(notification);
    }

    @Transactional
    public void markAllAsRead(Long recipientId) {
        log.info("Marking all notifications as read for recipient: {}", recipientId);
        List<Notification> unreadNotifications = notificationRepository
                .findByRecipientIdAndStatusOrderByCreatedAtDesc(recipientId, NotificationStatus.UNREAD);
        
        unreadNotifications.forEach(notification -> {
            notification.setStatus(NotificationStatus.READ);
            notification.setReadAt(LocalDateTime.now());
        });
        
        notificationRepository.saveAll(unreadNotifications);
    }

    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        log.info("Deleting notification {} by user {}", notificationId, userId);
        
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getRecipientId().equals(userId)) {
            throw new RuntimeException("User is not authorized to delete this notification");
        }

        notificationRepository.delete(notification);
    }

    private void sendEmailNotification(Notification notification) {
        try {
            // Get recipient email from User Service (would need to call User Service API)
            // For now, we'll use a placeholder
            String recipientEmail = "user@example.com"; // TODO: Fetch from User Service
            
            NotificationRequest emailRequest = NotificationRequest.builder()
                    .to(recipientEmail)
                    .subject(notification.getTitle())
                    .body(notification.getMessage())
                    .build();

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE,
                    "notification.email",
                    emailRequest
            );
            
            log.info("Email notification queued for notification ID: {}", notification.getId());
        } catch (Exception e) {
            log.error("Failed to queue email notification for notification ID: {}", notification.getId(), e);
        }
    }
}

