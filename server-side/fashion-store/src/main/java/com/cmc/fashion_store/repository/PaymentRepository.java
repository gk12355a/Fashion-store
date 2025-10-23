package com.cmc.fashion_store.repository;

import com.cmc.fashion_store.dto.MonthlyRevenueQueryResult;
import com.cmc.fashion_store.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param; // Thêm import

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    /**
     * Tìm kiếm tất cả thanh toán của một đơn hàng.
     * 
     * @param orderId ID của đơn hàng.
     * @return Danh sách thanh toán.
     */
    List<Payment> findByOrderId(Long orderId);

    /**
     * Tìm kiếm thanh toán theo phương thức (không phân biệt hoa thường).
     * 
     * @param paymentMethod Phương thức cần tìm.
     * @return Danh sách thanh toán.
     */
    List<Payment> findByPaymentMethodContainingIgnoreCase(String paymentMethod);

    // --- PHƯƠNG THỨC MỚI CHO AUTOCOMPLETE ---
    /**
     * Tìm các tên Phương thức Thanh toán (duy nhất) khớp với query.
     * 
     * @param query    Từ khóa tìm kiếm (VD: "Ti")
     * @param pageable Giới hạn số lượng (VD: 5 gợi ý)
     * @return Danh sách các chuỗi tên phương thức (VD: ["Tiền mặt"])
     */
    @Query("SELECT DISTINCT p.paymentMethod FROM Payment p WHERE LOWER(p.paymentMethod) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<String> findDistinctPaymentMethods(@Param("query") String query, Pageable pageable);

    // --- ADD THIS METHOD for Dashboard Summary ---
    /**
     * Calculates the total revenue within a specific date range.
     * 
     * @param startDate Start date/time (inclusive)
     * @param endDate   End date/time (exclusive)
     * @return Sum of amounts, or null if no payments found.
     */
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentDate >= :startDate AND p.paymentDate < :endDate")
    BigDecimal findTotalRevenueBetweenDates(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    // --------------------------------------------

    // --- ADD THIS METHOD for Monthly Revenue Chart ---
    /**
     * Finds the total revenue for each month within a specific year.
     * Uses MONTH() and YEAR() functions (check compatibility if not using MySQL/MariaDB).
     * @param year The target year.
     * @return A list of objects containing month number and total revenue for that month.
     */
    @Query("SELECT new com.cmc.fashion_store.dto.MonthlyRevenueQueryResult(MONTH(p.paymentDate), SUM(p.amount)) " +
           "FROM Payment p " +
           "WHERE YEAR(p.paymentDate) = :year " +
           "GROUP BY MONTH(p.paymentDate) " +
           "ORDER BY MONTH(p.paymentDate) ASC")
    List<MonthlyRevenueQueryResult> findMonthlyRevenueByYear(@Param("year") int year);
    // -------------------------------------------------
}