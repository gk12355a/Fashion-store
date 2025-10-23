package com.cmc.fashion_store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRevenueResponse {
    private int year;
    // List will always have 12 entries, representing Jan to Dec revenue
    private List<BigDecimal> monthlyRevenue;
}