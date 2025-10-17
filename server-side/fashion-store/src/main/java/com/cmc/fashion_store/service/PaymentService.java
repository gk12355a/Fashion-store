package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.CreatePaymentRequest; // Import DTO
import com.cmc.fashion_store.dto.PaymentResponse;
import com.cmc.fashion_store.dto.UpdatePaymentRequest;
import com.cmc.fashion_store.model.Payment; // Import Payment
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import java.util.List;

public interface PaymentService {
    /**
     * Lấy danh sách thanh toán có phân trang.
     * @param pageable đối tượng chứa thông tin phân trang.
     * @return một trang (Page) chứa danh sách PaymentResponse DTO.
     */
    Page<PaymentResponse> getAllPayments(Pageable pageable);
    /**
     * Tạo một giao dịch thanh toán mới.
     * @param request thông tin thanh toán mới.
     * @return Payment (Entity) đã được tạo.
     */
    Payment createPayment(CreatePaymentRequest request);
    /**
     * Xóa một giao dịch thanh toán dựa vào ID.
     * @param id ID của thanh toán cần xóa.
     */
    void deletePayment(Long id);
    /**
     * Tìm kiếm thanh toán dựa trên các tiêu chí tùy chọn.
     * @param orderId ID của đơn hàng (có thể null).
     * @param paymentMethod Phương thức thanh toán (có thể null).
     * @return Danh sách thanh toán phù hợp dưới dạng DTO.
     */
    List<PaymentResponse> searchPayments(Long orderId, String paymentMethod);
    /**
     * Cập nhật thông tin một giao dịch thanh toán.
     * @return PaymentResponse (DTO) của thanh toán đã được cập nhật.
     */
    PaymentResponse updatePayment(Long id, UpdatePaymentRequest request);
}