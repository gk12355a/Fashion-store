package com.cmc.fashion_store.repository;

import com.cmc.fashion_store.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    /**
     * Tìm kiếm tất cả thanh toán của một đơn hàng.
     * @param orderId ID của đơn hàng.
     * @return Danh sách thanh toán.
     */
    List<Payment> findByOrderId(Long orderId);

    /**
     * Tìm kiếm thanh toán theo phương thức (không phân biệt hoa thường).
     * @param paymentMethod Phương thức cần tìm.
     * @return Danh sách thanh toán.
     */
    List<Payment> findByPaymentMethodContainingIgnoreCase(String paymentMethod);
}