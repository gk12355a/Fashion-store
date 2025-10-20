package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.CreatePaymentRequest;
import com.cmc.fashion_store.dto.UpdatePaymentRequest; // Import DTO mới
import com.cmc.fashion_store.dto.PaymentResponse;
import com.cmc.fashion_store.model.Order; // Import Order
import com.cmc.fashion_store.model.Payment;
import com.cmc.fashion_store.repository.OrderRepository; // Import OrderRepository
import com.cmc.fashion_store.repository.PaymentRepository;
import com.cmc.fashion_store.service.PaymentService;
import jakarta.persistence.EntityNotFoundException; // Import Exception
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime; // Import LocalDateTime
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository; // Inject OrderRepository

    @Override
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        // 1. Lấy Page<Entity> từ repository
        Page<Payment> paymentPage = paymentRepository.findAll(pageable);

        // 2. Dùng .map() để chuyển đổi Page<Entity> thành Page<DTO>
        return paymentPage.map(this::convertToDto);
    }

    // Hàm helper để chuyển đổi Entity sang DTO
    private PaymentResponse convertToDto(Payment payment) {
        PaymentResponse dto = new PaymentResponse();
        dto.setId(payment.getId());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setAmount(payment.getAmount());
        dto.setPaymentDate(payment.getPaymentDate());
        if (payment.getOrder() != null) {
            dto.setOrderId(payment.getOrder().getId());
        }
        return dto;
    }

    @Override
    public Payment createPayment(CreatePaymentRequest request) {
        // 1. Kiểm tra Mã đơn hợp lệ
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Không tìm thấy Đơn hàng với ID: " + request.getOrderId()));

        // --- THÊM BƯỚC KIỂM TRA NGHIỆP VỤ ---
        // compareTo(BigDecimal.ZERO) <= 0 có nghĩa là "nhỏ hơn hoặc bằng 0"
        if (order.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            // Ném ra một lỗi rõ ràng
            throw new IllegalArgumentException("Không thể tạo thanh toán cho đơn hàng có tổng tiền bằng 0.");
        }
        // ------------------------------------

        // 2. Chuyển đổi từ DTO sang Entity
        Payment newPayment = new Payment();
        newPayment.setOrder(order);
        newPayment.setPaymentMethod(request.getPaymentMethod());
        newPayment.setPaymentDate(LocalDateTime.now());
        newPayment.setAmount(order.getTotalAmount()); // Tự động lấy tổng tiền

        // 3. Lưu vào database
        return paymentRepository.save(newPayment);
    }

    @Override
    public void deletePayment(Long id) {
        // Kiểm tra xem thanh toán có tồn tại không trước khi xóa
        if (!paymentRepository.existsById(id)) {
            // Nếu không tìm thấy, ném ra một exception để báo lỗi
            throw new EntityNotFoundException("Không tìm thấy thanh toán với ID: " + id);
        }
        paymentRepository.deleteById(id);
    }

    @Override
    public List<PaymentResponse> searchPayments(Long orderId, String paymentMethod) {
        List<Payment> results;
        if (orderId != null) {
            results = paymentRepository.findByOrderId(orderId);
        } else if (paymentMethod != null && !paymentMethod.isBlank()) {
            results = paymentRepository.findByPaymentMethodContainingIgnoreCase(paymentMethod);
        } else {
            return Collections.emptyList();
        }
        // Chuyển đổi kết quả tìm kiếm sang DTO
        return results.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentResponse updatePayment(Long id, UpdatePaymentRequest request) {
        // 1. Tìm thanh toán trong DB
        Payment existingPayment = paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thanh toán với ID: " + id));

        // 2. Cập nhật thông tin
        existingPayment.setPaymentMethod(request.getPaymentMethod());

        // --- XÓA LOGIC CẬP NHẬT SỐ TIỀN ---
        // Bạn không nên cho phép cập nhật số tiền của thanh toán một cách độc lập.
        // Nếu Order thay đổi, nên tạo một thanh toán mới hoặc hủy thanh toán cũ.
        // Dòng cũ bị xóa: existingPayment.setAmount(request.getAmount());
        // ---------------------------------

        // 3. Lưu lại vào DB
        Payment updatedPayment = paymentRepository.save(existingPayment);

        // 4. Chuyển đổi Entity đã cập nhật sang DTO để trả về
        return convertToDto(updatedPayment);
    }
}