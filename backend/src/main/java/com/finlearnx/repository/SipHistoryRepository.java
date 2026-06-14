package com.finlearnx.repository;

import com.finlearnx.entity.SipHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SipHistoryRepository extends JpaRepository<SipHistory, Long> {
    List<SipHistory> findByUserIdOrderByCalculatedAtDesc(Long userId);
}
