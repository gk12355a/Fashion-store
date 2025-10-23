package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.DashboardSummaryResponse;
import com.cmc.fashion_store.dto.SummaryStatDto;
import com.cmc.fashion_store.repository.CustomerRepository;
import com.cmc.fashion_store.repository.PaymentRepository;
import com.cmc.fashion_store.repository.ProductRepository;
import com.cmc.fashion_store.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;

@Service
@RequiredArgsConstructor // Use constructor injection
@Transactional(readOnly = true) // Most methods here are read-only
public class StatisticsServiceImpl implements StatisticsService {

    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;
    private final CustomerRepository customerRepository;

    @Override
    public DashboardSummaryResponse getDashboardSummary() {
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(today);
        YearMonth previousMonth = currentMonth.minusMonths(1);

        // Define date ranges for queries
        LocalDateTime currentMonthStart = currentMonth.atDay(1).atStartOfDay(); // Start of current month
        LocalDateTime currentMonthEnd = currentMonth.atEndOfMonth().plusDays(1).atStartOfDay(); // Start of next month (exclusive)

        LocalDateTime prevMonthStart = previousMonth.atDay(1).atStartOfDay(); // Start of previous month
        LocalDateTime prevMonthEnd = previousMonth.atEndOfMonth().plusDays(1).atStartOfDay(); // Start of current month (exclusive)

        // LocalDate versions for customer registration
        LocalDate currentMonthStartLd = currentMonth.atDay(1);
        LocalDate currentMonthEndLd = currentMonth.atEndOfMonth().plusDays(1);
        LocalDate prevMonthStartLd = previousMonth.atDay(1);
        LocalDate prevMonthEndLd = previousMonth.atEndOfMonth().plusDays(1);


        // 1. Calculate Product Stats
        long totalProductsCount = productRepository.count();
        // We'll skip product change percentage for simplicity as discussed
        SummaryStatDto productStats = new SummaryStatDto(totalProductsCount, null);

        // 2. Calculate Revenue Stats
        BigDecimal currentRevenue = paymentRepository.findTotalRevenueBetweenDates(currentMonthStart, currentMonthEnd);
        currentRevenue = (currentRevenue == null) ? BigDecimal.ZERO : currentRevenue; // Handle null result

        BigDecimal previousRevenue = paymentRepository.findTotalRevenueBetweenDates(prevMonthStart, prevMonthEnd);
        previousRevenue = (previousRevenue == null) ? BigDecimal.ZERO : previousRevenue;

        Double revenueChange = calculatePercentageChange(currentRevenue, previousRevenue);
        SummaryStatDto revenueStats = new SummaryStatDto(currentRevenue, revenueChange);

        // 3. Calculate Customer Stats
        long totalCustomersCount = customerRepository.count();
        Long newCustomersThisMonth = customerRepository.countNewCustomersBetweenDates(currentMonthStartLd, currentMonthEndLd);
        newCustomersThisMonth = (newCustomersThisMonth == null) ? 0L : newCustomersThisMonth;

        Long newCustomersLastMonth = customerRepository.countNewCustomersBetweenDates(prevMonthStartLd, prevMonthEndLd);
        newCustomersLastMonth = (newCustomersLastMonth == null) ? 0L : newCustomersLastMonth;

        Double customerChange = calculatePercentageChange(BigDecimal.valueOf(newCustomersThisMonth), BigDecimal.valueOf(newCustomersLastMonth));
        SummaryStatDto customerStats = new SummaryStatDto(totalCustomersCount, customerChange);


        // 4. Assemble Response
        return new DashboardSummaryResponse(productStats, revenueStats, customerStats);
    }

    /**
     * Helper method to calculate percentage change.
     * @param current Current value.
     * @param previous Previous value.
     * @return Percentage change, or null if previous is zero or null.
     */
    private Double calculatePercentageChange(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            // Cannot calculate change if previous value was zero or null
            // Return null or maybe a large number like 100.0 if current > 0? Let's use null.
            return null;
        }
        if (current == null) {
            current = BigDecimal.ZERO; // Assume current is zero if null
        }

        BigDecimal change = current.subtract(previous);
        BigDecimal percentageChange = change.divide(previous, 4, RoundingMode.HALF_UP) // 4 decimal places
                                              .multiply(new BigDecimal(100));
        return percentageChange.doubleValue();
    }
}