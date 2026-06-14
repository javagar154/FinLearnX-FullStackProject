package com.finlearnx.repository;

import com.finlearnx.entity.PremiumUnlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PremiumUnlockRepository extends JpaRepository<PremiumUnlock, Long> {
    List<PremiumUnlock> findByUserId(Long userId);
    Optional<PremiumUnlock> findByUserIdAndCourseId(Long userId, String courseId);
    boolean existsByUserIdAndCourseId(Long userId, String courseId);
}
