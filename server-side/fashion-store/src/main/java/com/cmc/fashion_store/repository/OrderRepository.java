package com.cmc.fashion_store.repository;

import com.cmc.fashion_store.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // JpaRepository đã cung cấp sẵn hàm findAll() để lấy tất cả đơn hàng.
}