package com.finlearnx.service;

import com.finlearnx.entity.QuizResult;
import com.finlearnx.entity.User;
import com.finlearnx.repository.QuizResultRepository;
import com.finlearnx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizResultRepository quizResultRepository;
    private final UserRepository userRepository;

    public QuizResult saveResult(Long userId, String courseId, int score, int totalQuestions) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        double percentage = ((double) score / totalQuestions) * 100;
        boolean passed = percentage >= 60;

        QuizResult result = QuizResult.builder()
                .user(user)
                .courseId(courseId)
                .score(score)
                .totalQuestions(totalQuestions)
                .percentage(Math.round(percentage * 100.0) / 100.0)
                .passed(passed)
                .build();

        return quizResultRepository.save(result);
    }

    public List<QuizResult> getUserResults(Long userId) {
        return quizResultRepository.findByUserIdOrderByCompletedAtDesc(userId);
    }

    public Optional<QuizResult> getBestResult(Long userId, String courseId) {
        return quizResultRepository.findTopByUserIdAndCourseIdOrderByCompletedAtDesc(userId, courseId);
    }
}
