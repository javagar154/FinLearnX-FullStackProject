package com.finlearnx.dto;

import com.finlearnx.entity.Portfolio;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Safe DTO for Portfolio — never exposes the lazy User proxy to Jackson.
 * This prevents the "could not initialize proxy — no Session" error.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioDto {
    private Long id;
    private String symbol;
    private String stockName;
    private Integer quantity;
    private Double averagePrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /** Convert entity → DTO inside an open Hibernate session (within @Transactional). */
    public static PortfolioDto from(Portfolio p) {
        return PortfolioDto.builder()
                .id(p.getId())
                .symbol(p.getSymbol())
                .stockName(p.getStockName())
                .quantity(p.getQuantity())
                .averagePrice(p.getAveragePrice())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
