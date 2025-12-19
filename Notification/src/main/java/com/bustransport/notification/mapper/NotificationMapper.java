package com.bustransport.notification.mapper;

import com.bustransport.notification.dto.NotificationResponse;
import com.bustransport.notification.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    NotificationMapper INSTANCE = Mappers.getMapper(NotificationMapper.class);

    NotificationResponse toResponse(Notification notification);
}

