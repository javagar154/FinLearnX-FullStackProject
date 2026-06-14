package com.finlearnx.controller;

import com.finlearnx.dto.ApiResponse;
import com.finlearnx.dto.TradeRequest;
import com.finlearnx.entity.Portfolio;
import com.finlearnx.entity.Transaction;
import com.finlearnx.entity.User;
import com.finlearnx.service.TradingService;
import com.finlearnx.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trading")
@RequiredArgsConstructor
public class TradingController {

    private final TradingService tradingService;
    private final UserService userService;

    @PostMapping("/trade")
    public ResponseEntity<ApiResponse<Transaction>> executeTrade(@Valid @RequestBody TradeRequest request) {
        User user = userService.getCurrentUser();
        Transaction tx = tradingService.executeTrade(user.getId(), request);
        String msg = request.getType().equalsIgnoreCase("BUY")
                ? "Bought " + request.getQuantity() + " shares of " + request.getSymbol()
                : "Sold " + request.getQuantity() + " shares of " + request.getSymbol();
        return ResponseEntity.ok(ApiResponse.success(msg, tx));
    }

    @GetMapping("/portfolio")
    public ResponseEntity<ApiResponse<List<Portfolio>>> getPortfolio() {
        User user = userService.getCurrentUser();
        List<Portfolio> portfolio = tradingService.getPortfolio(user.getId());
        return ResponseEntity.ok(ApiResponse.success(portfolio));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<Transaction>>> getTransactions() {
        User user = userService.getCurrentUser();
        List<Transaction> transactions = tradingService.getTransactions(user.getId());
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/wallet")
    public ResponseEntity<ApiResponse<Double>> getWalletBalance() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(user.getWalletBalance()));
    }
}
