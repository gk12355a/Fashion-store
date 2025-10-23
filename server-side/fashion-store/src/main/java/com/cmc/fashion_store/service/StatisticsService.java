package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.DashboardSummaryResponse;

public interface StatisticsService {
    /**
     * Gathers summary statistics for the dashboard.
     * @return DashboardSummaryResponse containing totals and changes.
     */
    DashboardSummaryResponse getDashboardSummary();
}