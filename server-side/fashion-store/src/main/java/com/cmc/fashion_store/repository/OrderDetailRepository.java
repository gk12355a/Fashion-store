package com.cmc.fashion_store.repository;

import com.cmc.fashion_store.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    // JpaRepository đã cung cấp sẵn hàm findAll().
    /**
     * Tìm kiếm tất cả chi tiết đơn hàng thuộc về một đơn hàng.
     * @param orderId ID của đơn hàng.
     * @return Danh sách chi tiết đơn hàng.
     */
    List<OrderDetail> findByOrderId(Long orderId);

    /**
     * Tìm kiếm tất cả chi tiết đơn hàng liên quan đến một sản phẩm.
     * @param productId ID của sản phẩm.
     * @return Danh sách chi tiết đơn hàng.
     */
    List<OrderDetail> findByProductId(Long productId);
}