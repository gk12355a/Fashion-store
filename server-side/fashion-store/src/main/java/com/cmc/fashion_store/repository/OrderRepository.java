package com.cmc.fashion_store.repository;

import com.cmc.fashion_store.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // JpaRepository đã cung cấp sẵn hàm findAll() để lấy tất cả đơn hàng.
    /**
     * Tìm kiếm tất cả đơn hàng của một khách hàng.
     * @param customerId ID của khách hàng.
     * @return Danh sách đơn hàng.
     */
    List<Order> findByCustomerId(Long customerId);

    /**
     * Tìm kiếm đơn hàng theo trạng thái (không phân biệt hoa thường).
     * @param status Trạng thái cần tìm.
     * @return Danh sách đơn hàng.
     */
    List<Order> findByStatusContainingIgnoreCase(String status);
}