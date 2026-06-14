package com.finlearnx.controller;

import com.finlearnx.dto.ApiResponse;
import com.finlearnx.entity.Expense;
import com.finlearnx.entity.User;
import com.finlearnx.service.ExpenseService;
import com.finlearnx.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<Expense>> addExpense(@RequestBody Map<String, Object> body) {
        User user = userService.getCurrentUser();
        String category = (String) body.get("category");
        String description = (String) body.get("description");
        Double amount = Double.parseDouble(body.get("amount").toString());
        LocalDate date = LocalDate.parse((String) body.get("date"));

        Expense expense = expenseService.addExpense(user.getId(), category, description, amount, date);
        return ResponseEntity.ok(ApiResponse.success("Expense added", expense));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Expense>>> getExpenses() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(expenseService.getExpenses(user.getId())));
    }

    @GetMapping("/range")
    public ResponseEntity<ApiResponse<List<Expense>>> getExpensesByRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(
                expenseService.getExpensesByDateRange(user.getId(), start, end)));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<Map<String, Double>>> getCategoryTotals() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(expenseService.getCategoryTotals(user.getId())));
    }

    @GetMapping("/total")
    public ResponseEntity<ApiResponse<Double>> getTotal() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(expenseService.getTotalExpenses(user.getId())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable Long id) {
        User user = userService.getCurrentUser();
        expenseService.deleteExpense(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted", null));
    }
}
