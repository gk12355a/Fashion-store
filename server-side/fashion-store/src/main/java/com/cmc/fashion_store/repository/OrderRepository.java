package com.cmc.fashion_store.repository;

import com.cmc.fashion_store.model.Order;
import org.springframework.data.domain.Page; // <-- 1. Thêm import
import org.springframework.data.domain.Pageable; // <-- 2. Thêm import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime; // <-- 3. Thêm import
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

        // --- CÁC PHƯƠNG THỨC CŨ (DÙNG CHO /search) ---
        /**
         * Tìm kiếm tất cả đơn hàng của một khách hàng.
         * 
         * @param customerId ID của khách hàng.
         * @return Danh sách đơn hàng.
         */
        List<Order> findByCustomerId(Long customerId);

        /**
         * Tìm kiếm đơn hàng theo trạng thái (không phân biệt hoa thường).
         * 
         * @param status Trạng thái cần tìm.
         * @return Danh sách đơn hàng.
         */
        List<Order> findByStatusContainingIgnoreCase(String status);

        // --- CÁC PHƯƠNG THỨC MỚI (DÙNG CHO /orders CÓ PHÂN TRANG VÀ FILTER) ---
        // (Đây là các phương thức mà OrderServiceImpl File 18 đang gọi)

        /**
         * Tìm theo CustomerID (có phân trang)
         */
        Page<Order> findByCustomerId(Long customerId, Pageable pageable);

        /**
         * Tìm theo Status (có phân trang)
         */
        Page<Order> findByStatusContainingIgnoreCase(String status, Pageable pageable);

        /**
         * Tìm theo Ngày (có phân trang)
         */
        Page<Order> findByOrderDateBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

        /**
         * Tìm theo CustomerID VÀ Status (có phân trang)
         */
        Page<Order> findByCustomerIdAndStatusContainingIgnoreCase(
                        Long customerId, String status, Pageable pageable);

        /**
         * Tìm theo CustomerID VÀ Ngày (có phân trang)
         */
        Page<Order> findByCustomerIdAndOrderDateBetween(
                        Long customerId, LocalDateTime start, LocalDateTime end, Pageable pageable);

        /**
         * Tìm theo Status VÀ Ngày (có phân trang)
         */
        Page<Order> findByStatusContainingIgnoreCaseAndOrderDateBetween(
                        String status, LocalDateTime start, LocalDateTime end, Pageable pageable);

        /**
         * Tìm theo cả 3 tiêu chí (có phân trang)
         */
        Page<Order> findByCustomerIdAndStatusContainingIgnoreCaseAndOrderDateBetween(
                        Long customerId, String status, LocalDateTime start, LocalDateTime end, Pageable pageable);

        /**
         * Lấy TẤT CẢ các đơn hàng trong một dải ngày (dùng cho export).
         * 
         * @param start Thời điểm bắt đầu (LocalDateTime)
         * @param end   Thời điểm kết thúc (LocalDateTime)
         * @return Danh sách Order (Entity)
         */
        List<Order> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);
}