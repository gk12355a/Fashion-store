package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.DashboardSummaryResponse;
import com.cmc.fashion_store.dto.MonthlyRevenueResponse;

public interface StatisticsService {
    /**
     * Gathers summary statistics for the dashboard.
     * @return DashboardSummaryResponse containing totals and changes.
     */
    DashboardSummaryResponse getDashboardSummary();
    // --- ADD THIS METHOD SIGNATURE ---
    /**
     * Gets the total revenue for each month of a given year.
     * @param year The year to fetch data for.
     * @return MonthlyRevenueResponse containing the year and a list of 12 monthly revenues.
     */
    MonthlyRevenueResponse getMonthlyRevenue(int year);
    // --------------------------
}