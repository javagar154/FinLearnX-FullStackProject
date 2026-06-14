package com.finlearnx.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TradeRequest {
    @NotBlank(message = "Symbol is required")
    private String symbol;

    @NotBlank(message = "Stock name is required")
    private String stockName;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    @NotBlank(message = "Trade type is required")
    private String type; // BUY or SELL
}
