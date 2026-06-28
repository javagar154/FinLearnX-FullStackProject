package com.finlearnx.controller;

import com.finlearnx.dto.ApiResponse;
import com.finlearnx.dto.PortfolioDto;
import com.finlearnx.dto.TradeRequest;
import com.finlearnx.dto.TransactionDto;
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
    private final UserService    userService;

    /**
     * POST /api/trading/trade
     * Returns TransactionDto — no Hibernate proxy, no LazyInitializationException.
     */
    @PostMapping("/trade")
    public ResponseEntity<ApiResponse<TransactionDto>> executeTrade(
            @Valid @RequestBody TradeRequest request) {

        User user = userService.getCurrentUser();
        TransactionDto tx = tradingService.executeTrade(user.getId(), request);

        String msg = request.getType().equalsIgnoreCase("BUY")
                ? "Bought " + request.getQuantity() + " shares of " + request.getSymbol()
                : "Sold "   + request.getQuantity() + " shares of " + request.getSymbol();

        return ResponseEntity.ok(ApiResponse.success(msg, tx));
    }

    /**
     * GET /api/trading/portfolio
     * Returns List<PortfolioDto> — safe for serialisation.
     */
    @GetMapping("/portfolio")
    public ResponseEntity<ApiResponse<List<PortfolioDto>>> getPortfolio() {
        User user = userService.getCurrentUser();
        List<PortfolioDto> portfolio = tradingService.getPortfolio(user.getId());
        return ResponseEntity.ok(ApiResponse.success(portfolio));
    }

    /**
     * GET /api/trading/transactions
     * Returns List<TransactionDto> — safe for serialisation.
     */
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<TransactionDto>>> getTransactions() {
        User user = userService.getCurrentUser();
        List<TransactionDto> transactions = tradingService.getTransactions(user.getId());
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    /**
     * GET /api/trading/wallet
     */
    @GetMapping("/wallet")
    public ResponseEntity<ApiResponse<Double>> getWalletBalance() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(user.getWalletBalance()));
    }
}
