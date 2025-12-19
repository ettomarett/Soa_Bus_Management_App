package com.bustransport.subscription.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationClient {

    private final RestTemplate restTemplate;

    @Value("${notification.service.url:http://notification-service:8087}")
    private String notificationServiceUrl;

    public void sendNotification(Long recipientId, Long senderId, String title, String message, String type, String metadata) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("recipientId", recipientId);
            request.put("senderId", senderId);
            request.put("title", title);
            request.put("message", message);
            request.put("type", type);
            if (metadata != null) {
                request.put("metadata", metadata);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

            String url = notificationServiceUrl + "/api/v1/notifications";
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Notification sent successfully to user {}", recipientId);
            } else {
                log.warn("Failed to send notification. Status: {}", response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Error sending notification to user {}: {}", recipientId, e.getMessage());
            // Don't throw exception - notification failure shouldn't break subscription creation
        }
    }
}

