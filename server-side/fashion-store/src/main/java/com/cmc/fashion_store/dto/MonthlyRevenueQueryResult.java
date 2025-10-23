package com.cmc.fashion_store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

// This DTO directly maps to the JPQL query result
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRevenueQueryResult {
    private Integer month; // Month number (1-12)
    private BigDecimal revenue; // Total revenue for that month
}