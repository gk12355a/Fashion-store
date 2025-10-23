package com.cmc.fashion_store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SummaryStatDto {
    // Use Long for counts, BigDecimal for monetary values
    private Number currentValue;
    private Double changePercent; // Percentage change vs last month (can be null)
}