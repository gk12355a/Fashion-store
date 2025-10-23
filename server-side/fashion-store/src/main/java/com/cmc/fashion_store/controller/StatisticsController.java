package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.CategoryCountDto;
import com.cmc.fashion_store.dto.DashboardSummaryResponse;
import com.cmc.fashion_store.dto.MonthlyRevenueResponse;
import com.cmc.fashion_store.service.StatisticsService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/statistics") // Base path /api/v1/statistics
@RequiredArgsConstructor // Use constructor injection
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary() {
        DashboardSummaryResponse summary = statisticsService.getDashboardSummary();
        return ResponseEntity.ok(summary);
    }

    // --- ADD THIS ENDPOINT ---
    @GetMapping("/revenue/monthly")
    public ResponseEntity<MonthlyRevenueResponse> getMonthlyRevenue(
            // Use defaultValue to automatically get the current year if param is missing
            @RequestParam(required = false, defaultValue = "#{T(java.time.LocalDate).now().getYear()}") int year
    ) {
        MonthlyRevenueResponse monthlyRevenue = statisticsService.getMonthlyRevenue(year);
        return ResponseEntity.ok(monthlyRevenue);
    }
    // -------------------------
    // --- ADD THIS ENDPOINT ---
    @GetMapping("/products/by-category")
    public ResponseEntity<List<CategoryCountDto>> getProductCountByCategory() {
        List<CategoryCountDto> categoryCounts = statisticsService.getProductCountByCategory();
        return ResponseEntity.ok(categoryCounts);
    }
    // -------------------------
    // @GetMapping("/customers/new/weekly") ...

}