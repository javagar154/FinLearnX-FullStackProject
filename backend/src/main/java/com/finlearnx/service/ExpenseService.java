package com.finlearnx.service;

import com.finlearnx.entity.Expense;
import com.finlearnx.entity.User;
import com.finlearnx.repository.ExpenseRepository;
import com.finlearnx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public Expense addExpense(Long userId, String category, String description, Double amount, LocalDate date) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = Expense.builder()
                .user(user)
                .category(category)
                .description(description)
                .amount(amount)
                .date(date)
                .build();

        return expenseRepository.save(expense);
    }

    public List<Expense> getExpenses(Long userId) {
        return expenseRepository.findByUserIdOrderByDateDesc(userId);
    }

    public List<Expense> getExpensesByDateRange(Long userId, LocalDate start, LocalDate end) {
        return expenseRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, start, end);
    }

    public Map<String, Double> getCategoryTotals(Long userId) {
        List<Expense> expenses = expenseRepository.findByUserIdOrderByDateDesc(userId);
        return expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.summingDouble(Expense::getAmount)
                ));
    }

    public void deleteExpense(Long userId, Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        if (!expense.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this expense");
        }
        expenseRepository.delete(expense);
    }

    public double getTotalExpenses(Long userId) {
        return expenseRepository.findByUserIdOrderByDateDesc(userId)
                .stream().mapToDouble(Expense::getAmount).sum();
    }
}
