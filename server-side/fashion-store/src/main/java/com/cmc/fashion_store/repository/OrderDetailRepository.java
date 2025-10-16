package com.cmc.fashion_store.repository;

import com.cmc.fashion_store.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    // JpaRepository đã cung cấp sẵn hàm findAll().
}