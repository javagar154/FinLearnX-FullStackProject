package com.finlearnx.service;

import com.finlearnx.dto.PortfolioDto;
import com.finlearnx.dto.TradeRequest;
import com.finlearnx.dto.TransactionDto;
import com.finlearnx.entity.Portfolio;
import com.finlearnx.entity.Transaction;
import com.finlearnx.entity.User;
import com.finlearnx.repository.PortfolioRepository;
import com.finlearnx.repository.TransactionRepository;
import com.finlearnx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TradingService {

    private final UserRepository      userRepository;
    private final PortfolioRepository portfolioRepository;
    private final TransactionRepository transactionRepository;

    /**
     * Execute BUY or SELL trade.
     * Returns TransactionDto — safe for JSON serialisation (no Hibernate proxy exposure).
     */
    @Transactional
    public TransactionDto executeTrade(Long userId, TradeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        double totalAmount = request.getPrice() * request.getQuantity();

        Transaction tx;
        if ("BUY".equalsIgnoreCase(request.getType())) {
            tx = executeBuy(user, request, totalAmount);
        } else if ("SELL".equalsIgnoreCase(request.getType())) {
            tx = executeSell(user, request, totalAmount);
        } else {
            throw new RuntimeException("Invalid trade type. Use BUY or SELL");
        }
        // Convert to DTO inside the @Transactional boundary — Hibernate session is still open
        return TransactionDto.from(tx);
    }

    private Transaction executeBuy(User user, TradeRequest request, double totalAmount) {
        if (user.getWalletBalance() < totalAmount) {
            throw new RuntimeException(
                "Insufficient wallet balance. Required: ₹" + totalAmount +
                ", Available: ₹" + user.getWalletBalance());
        }

        user.setWalletBalance(user.getWalletBalance() - totalAmount);
        userRepository.save(user);

        Optional<Portfolio> existing = portfolioRepository.findByUserIdAndSymbol(user.getId(), request.getSymbol());
        if (existing.isPresent()) {
            Portfolio portfolio = existing.get();
            double newAvgPrice =
                ((portfolio.getAveragePrice() * portfolio.getQuantity()) + totalAmount)
                / (portfolio.getQuantity() + request.getQuantity());
            portfolio.setQuantity(portfolio.getQuantity() + request.getQuantity());
            portfolio.setAveragePrice(newAvgPrice);
            portfolioRepository.save(portfolio);
        } else {
            Portfolio portfolio = Portfolio.builder()
                    .user(user)
                    .symbol(request.getSymbol())
                    .stockName(request.getStockName())
                    .quantity(request.getQuantity())
                    .averagePrice(request.getPrice())
                    .build();
            portfolioRepository.save(portfolio);
        }

        return saveTransaction(user, request, totalAmount, Transaction.TransactionType.BUY);
    }

    private Transaction executeSell(User user, TradeRequest request, double totalAmount) {
        Portfolio portfolio = portfolioRepository.findByUserIdAndSymbol(user.getId(), request.getSymbol())
                .orElseThrow(() -> new RuntimeException("No holdings found for " + request.getSymbol()));

        if (portfolio.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient shares. Available: " + portfolio.getQuantity());
        }

        user.setWalletBalance(user.getWalletBalance() + totalAmount);
        userRepository.save(user);

        int newQty = portfolio.getQuantity() - request.getQuantity();
        if (newQty == 0) {
            portfolioRepository.delete(portfolio);
        } else {
            portfolio.setQuantity(newQty);
            portfolioRepository.save(portfolio);
        }

        return saveTransaction(user, request, totalAmount, Transaction.TransactionType.SELL);
    }

    private Transaction saveTransaction(User user, TradeRequest request,
                                        double totalAmount, Transaction.TransactionType type) {
        Transaction tx = Transaction.builder()
                .user(user)
                .symbol(request.getSymbol())
                .stockName(request.getStockName())
                .type(type)
                .quantity(request.getQuantity())
                .price(request.getPrice())
                .totalAmount(totalAmount)
                .build();
        return transactionRepository.save(tx);
    }

    /**
     * Returns list of PortfolioDto — safe for JSON serialisation.
     * Mapped inside @Transactional so Hibernate session is active.
     */
    @Transactional(readOnly = true)
    public List<PortfolioDto> getPortfolio(Long userId) {
        return portfolioRepository.findByUserId(userId)
                .stream()
                .map(PortfolioDto::from)
                .collect(Collectors.toList());
    }

    /**
     * Returns list of TransactionDto — safe for JSON serialisation.
     */
    @Transactional(readOnly = true)
    public List<TransactionDto> getTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(TransactionDto::from)
                .collect(Collectors.toList());
    }
}
