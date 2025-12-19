package com.bustransport.notification.entity;

public enum NotificationType {
    TICKET_VALIDATION_SUCCESS,    // Controller validated ticket successfully
    TICKET_VALIDATION_FAILED,      // Controller found invalid ticket
    TICKET_VIOLATION,              // Controller reported ticket violation
    CONTROLLER_WARNING,            // Controller sent warning to passenger
    PASSENGER_REPORT,              // Passenger reported issue to controller
    SYSTEM_ALERT,                  // System-generated alert
    TICKET_REMINDER,               // Reminder about ticket expiration
    TICKET_PURCHASED,              // User purchased a ticket
    SUBSCRIPTION_ACTIVATED         // User activated a subscription
}

