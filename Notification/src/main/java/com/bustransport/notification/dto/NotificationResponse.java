package com.bustransport.notification.dto;

import com.bustransport.notification.entity.NotificationStatus;
import com.bustransport.notification.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    private Long recipientId;
    private Long senderId;
    private String title;
    private String message;
    private NotificationType type;
    private NotificationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
    private String metadata;
}

