package com.finlearnx.repository;

import com.finlearnx.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByUserIdOrderByCompletedAtDesc(Long userId);
    Optional<QuizResult> findTopByUserIdAndCourseIdOrderByCompletedAtDesc(Long userId, String courseId);
}
