package com.finlearnx.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class SipRequest {
    @NotNull
    @Positive(message = "Monthly amount must be positive")
    private Double monthlyAmount;

    @NotNull
    @Min(1) @Max(50)
    private Double annualRate;

    @NotNull
    @Min(1) @Max(40)
    private Integer durationYears;
}
