package com.finlearnx.service;

import com.finlearnx.entity.Notification;
import com.finlearnx.entity.PremiumUnlock;
import com.finlearnx.entity.User;
import com.finlearnx.repository.NotificationRepository;
import com.finlearnx.repository.PremiumUnlockRepository;
import com.finlearnx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PremiumService {

    private final PremiumUnlockRepository premiumUnlockRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Transactional
    public PremiumUnlock unlockCourse(Long userId, String courseId) {
        if (premiumUnlockRepository.existsByUserIdAndCourseId(userId, courseId)) {
            return premiumUnlockRepository.findByUserIdAndCourseId(userId, courseId)
                    .orElseThrow(() -> new RuntimeException("Unlock record not found"));
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PremiumUnlock unlock = PremiumUnlock.builder()
                .user(user)
                .courseId(courseId)
                .paymentStatus("COMPLETED")
                .amountPaid(100.0)
                .build();

        PremiumUnlock saved = premiumUnlockRepository.save(unlock);

        // Fire notification
        notificationRepository.save(Notification.builder()
                .user(user)
                .type("info")
                .title("Premium Course Unlocked!")
                .message("You have unlocked: " + courseId + ". Start learning now!")
                .build());

        return saved;
    }

    public boolean isCourseUnlocked(Long userId, String courseId) {
        return premiumUnlockRepository.existsByUserIdAndCourseId(userId, courseId);
    }

    public List<String> getUnlockedCourseIds(Long userId) {
        return premiumUnlockRepository.findByUserId(userId)
                .stream()
                .map(PremiumUnlock::getCourseId)
                .collect(Collectors.toList());
    }
}
