package com.bustransport.notification.dto;

import com.bustransport.notification.entity.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateNotificationRequest {
    @NotNull(message = "Recipient ID is required")
    private Long recipientId;

    @NotNull(message = "Sender ID is required")
    private Long senderId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @NotNull(message = "Type is required")
    private NotificationType type;

    private String metadata; // JSON string for additional data
}

