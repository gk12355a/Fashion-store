package com.cmc.fashion_store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private SummaryStatDto totalProducts;
    private SummaryStatDto totalRevenue; // Represents current month's revenue
    private SummaryStatDto totalCustomers;
}