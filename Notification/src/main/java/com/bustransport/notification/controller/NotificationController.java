package com.bustransport.notification.controller;

import com.bustransport.notification.dto.CreateNotificationRequest;
import com.bustransport.notification.dto.NotificationResponse;
import com.bustransport.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(@Valid @RequestBody CreateNotificationRequest request) {
        log.info("Creating notification: {}", request);
        NotificationResponse response = notificationService.createNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/recipient/{recipientId}")
    public ResponseEntity<Page<NotificationResponse>> getNotificationsByRecipient(
            @PathVariable Long recipientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Fetching notifications for recipient: {}", recipientId);
        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationResponse> notifications = notificationService.getNotificationsByRecipient(recipientId, pageable);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/recipient/{recipientId}/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(@PathVariable Long recipientId) {
        log.info("Fetching unread notifications for recipient: {}", recipientId);
        List<NotificationResponse> notifications = notificationService.getUnreadNotifications(recipientId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/recipient/{recipientId}/unread/count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long recipientId) {
        log.info("Fetching unread count for recipient: {}", recipientId);
        long count = notificationService.getUnreadCount(recipientId);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable Long notificationId,
            @RequestParam Long userId) {
        log.info("Marking notification {} as read by user {}", notificationId, userId);
        NotificationResponse response = notificationService.markAsRead(notificationId, userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/recipient/{recipientId}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long recipientId) {
        log.info("Marking all notifications as read for recipient: {}", recipientId);
        notificationService.markAllAsRead(recipientId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long notificationId,
            @RequestParam Long userId) {
        log.info("Deleting notification {} by user {}", notificationId, userId);
        notificationService.deleteNotification(notificationId, userId);
        return ResponseEntity.noContent().build();
    }
}

