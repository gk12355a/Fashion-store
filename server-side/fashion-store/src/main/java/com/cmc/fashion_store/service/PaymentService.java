package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.PaymentResponse;
import java.util.List;

public interface PaymentService {
    /**
     * Lấy danh sách tất cả các giao dịch thanh toán dưới dạng DTO.
     * @return danh sách PaymentResponse.
     */
    List<PaymentResponse> getAllPayments();
}