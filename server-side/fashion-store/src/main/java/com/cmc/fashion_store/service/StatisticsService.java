package com.cmc.fashion_store.service;

import java.util.List;

import com.cmc.fashion_store.dto.CategoryCountDto;
import com.cmc.fashion_store.dto.DashboardSummaryResponse;
import com.cmc.fashion_store.dto.MonthlyRevenueResponse;

public interface StatisticsService {
    /**
     * Gathers summary statistics for the dashboard.
     * 
     * @return DashboardSummaryResponse containing totals and changes.
     */
    DashboardSummaryResponse getDashboardSummary();

    // --- ADD THIS METHOD SIGNATURE ---
    /**
     * Gets the total revenue for each month of a given year.
     * 
     * @param year The year to fetch data for.
     * @return MonthlyRevenueResponse containing the year and a list of 12 monthly
     *         revenues.
     */
    MonthlyRevenueResponse getMonthlyRevenue(int year);

    // --------------------------
    // --- ADD THIS METHOD SIGNATURE ---
    /**
     * Gets the count of products for each category (type).
     * 
     * @return A list of CategoryCountDto.
     */
    List<CategoryCountDto> getProductCountByCategory();
    // ---------------------------------
    // --- ADD THIS METHOD SIGNATURE ---
    /**
     * Gets the count of new customers registered per week for the last N weeks.
     * @param numberOfWeeks How many recent weeks to include.
     * @return A list of counts, ordered from oldest week to newest week.
     */
    List<Long> getWeeklyNewCustomers(int numberOfWeeks);
    // ---------------------------------
}