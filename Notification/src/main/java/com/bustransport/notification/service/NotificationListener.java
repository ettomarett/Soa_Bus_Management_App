package com.bustransport.notification.service;

import com.bustransport.notification.config.RabbitMQConfig;
import com.bustransport.notification.dto.NotificationRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationListener {

    private final EmailService emailService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE)
    public void consume(NotificationRequest request) {
        log.info("Received notification request: {}", request);
        emailService.sendEmail(request);
    }
}
