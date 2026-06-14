package com.finlearnx.service;

import com.finlearnx.entity.Notification;
import com.finlearnx.entity.User;
import com.finlearnx.repository.NotificationRepository;
import com.finlearnx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public Notification addNotification(Long userId, String type, String title, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.save(
                Notification.builder()
                        .user(user)
                        .type(type)
                        .title(title)
                        .message(message)
                        .build()
        );
    }

    public List<Notification> getAll(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnread(Long userId) {
        // field is primitive boolean "read" → repository method ReadFalse works
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void markAllRead(Long userId) {
        notificationRepository.markAllReadByUserId(userId);
    }

    @Transactional
    public void markRead(Long userId, Long notifId) {
        notificationRepository.findById(notifId).ifPresent(n -> {
            if (n.getUser().getId().equals(userId)) {
                n.setRead(true);          // Lombok generates setRead() for primitive boolean "read"
                notificationRepository.save(n);
            }
        });
    }

    @Transactional
    public void clearAll(Long userId) {
        List<Notification> notifs = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notificationRepository.deleteAll(notifs);
    }
}
