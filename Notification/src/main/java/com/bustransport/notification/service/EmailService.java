package com.bustransport.notification.service;

import com.bustransport.notification.dto.NotificationRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;

    public void sendEmail(NotificationRequest request) {
        try {
            log.info("Sending email to: {}", request.getTo());
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@bustransport.com");
            message.setTo(request.getTo());
            message.setSubject(request.getSubject());
            message.setText(request.getBody());

            javaMailSender.send(message);
            log.info("Email sent successfully to: {}", request.getTo());
        } catch (Exception e) {
            log.error("Failed to send email to: {}", request.getTo(), e);
        }
    }
}
