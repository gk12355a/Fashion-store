package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.DashboardSummaryResponse;
import com.cmc.fashion_store.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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

    // --- Add other statistic endpoints here later ---
    // @GetMapping("/revenue/monthly") ...
    // @GetMapping("/products/by-category") ...
    // @GetMapping("/customers/new/weekly") ...

}