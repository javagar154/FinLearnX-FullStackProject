package com.finlearnx.dto;

import com.finlearnx.entity.Transaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Safe DTO for Transaction — prevents LazyInitializationException on User proxy.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDto {
    private Long id;
    private String symbol;
    private String stockName;
    private String type;
    private Integer quantity;
    private Double price;
    private Double totalAmount;
    private LocalDateTime createdAt;

    public static TransactionDto from(Transaction t) {
        return TransactionDto.builder()
                .id(t.getId())
                .symbol(t.getSymbol())
                .stockName(t.getStockName())
                .type(t.getType().name())
                .quantity(t.getQuantity())
                .price(t.getPrice())
                .totalAmount(t.getTotalAmount())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
