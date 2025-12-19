package com.bustransport.notification.repository;

import com.bustransport.notification.entity.Notification;
import com.bustransport.notification.entity.NotificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    Page<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId, Pageable pageable);
    
    List<Notification> findByRecipientIdAndStatusOrderByCreatedAtDesc(Long recipientId, NotificationStatus status);
    
    long countByRecipientIdAndStatus(Long recipientId, NotificationStatus status);
    
    @Query("SELECT n FROM Notification n WHERE n.recipientId = :recipientId AND n.createdAt >= :since ORDER BY n.createdAt DESC")
    List<Notification> findRecentByRecipientId(@Param("recipientId") Long recipientId, @Param("since") LocalDateTime since);
    
    @Query("SELECT n FROM Notification n WHERE n.senderId = :senderId ORDER BY n.createdAt DESC")
    Page<Notification> findBySenderId(@Param("senderId") Long senderId, Pageable pageable);
}

