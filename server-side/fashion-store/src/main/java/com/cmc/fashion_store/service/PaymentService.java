package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.CreatePaymentRequest; // Import DTO
import com.cmc.fashion_store.dto.PaymentResponse;
import com.cmc.fashion_store.model.Payment; // Import Payment
import java.util.List;

public interface PaymentService {
    /**
     * Lấy danh sách tất cả các giao dịch thanh toán dưới dạng DTO.
     * @return danh sách PaymentResponse.
     */
    List<PaymentResponse> getAllPayments();
    /**
     * Tạo một giao dịch thanh toán mới.
     * @param request thông tin thanh toán mới.
     * @return Payment (Entity) đã được tạo.
     */
    Payment createPayment(CreatePaymentRequest request);
}