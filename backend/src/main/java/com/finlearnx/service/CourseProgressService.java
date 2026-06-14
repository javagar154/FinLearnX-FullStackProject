package com.finlearnx.service;

import com.finlearnx.entity.CourseProgress;
import com.finlearnx.entity.Notification;
import com.finlearnx.entity.User;
import com.finlearnx.repository.CourseProgressRepository;
import com.finlearnx.repository.NotificationRepository;
import com.finlearnx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseProgressService {

    private final CourseProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Transactional
    public CourseProgress saveProgress(Long userId, String courseId, int percent, int pagesRead) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CourseProgress progress = progressRepository
                .findByUserIdAndCourseId(userId, courseId)
                .orElse(CourseProgress.builder().user(user).courseId(courseId).build());

        progress.setProgressPercent(percent);
        progress.setPagesRead(pagesRead);
        progress.setLastAccessedAt(LocalDateTime.now());

        if (percent >= 100 && !Boolean.TRUE.equals(progress.isCompleted())) {
            progress.setCompleted(true);
            notificationRepository.save(Notification.builder()
                    .user(user).type("info")
                    .title("Course Completed! 🎉")
                    .message("You completed: " + courseId + ". Take the quiz to earn your badge!")
                    .build());
        }
        return progressRepository.save(progress);
    }

    @Transactional
    public CourseProgress saveQuizScore(Long userId, String courseId, int score) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CourseProgress progress = progressRepository
                .findByUserIdAndCourseId(userId, courseId)
                .orElse(CourseProgress.builder().user(user).courseId(courseId).build());

        progress.setQuizScore(score);
        if (score >= 60) {
            progress.setCompleted(true);
            notificationRepository.save(Notification.builder()
                    .user(user).type("info")
                    .title("Quiz Passed! 🏆")
                    .message("You scored " + score + "% on " + courseId + " quiz. Badge earned!")
                    .build());
        }
        return progressRepository.save(progress);
    }

    public List<CourseProgress> getAllProgress(Long userId) {
        return progressRepository.findByUserId(userId);
    }

    public Map<String, Object> getProgressMap(Long userId) {
        return progressRepository.findByUserId(userId).stream()
                .collect(Collectors.toMap(
                        CourseProgress::getCourseId,
                        p -> Map.of(
                                "percent", p.getProgressPercent(),
                                "pagesRead", p.getPagesRead(),
                                "completed", p.isCompleted(),
                                "quizScore", p.getQuizScore() != null ? p.getQuizScore() : 0
                        )
                ));
    }
}
