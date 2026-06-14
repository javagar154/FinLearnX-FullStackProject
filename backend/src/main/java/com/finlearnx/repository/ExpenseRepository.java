package com.finlearnx.repository;

import com.finlearnx.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserIdOrderByDateDesc(Long userId);
    List<Expense> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate start, LocalDate end);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND e.category = :category")
    Double sumByUserIdAndCategory(Long userId, String category);
}
