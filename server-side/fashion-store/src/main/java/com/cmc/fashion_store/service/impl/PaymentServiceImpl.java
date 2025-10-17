package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.CreatePaymentRequest;
import com.cmc.fashion_store.dto.PaymentResponse;
import com.cmc.fashion_store.model.Order; // Import Order
import com.cmc.fashion_store.model.Payment;
import com.cmc.fashion_store.repository.OrderRepository; // Import OrderRepository
import com.cmc.fashion_store.repository.PaymentRepository;
import com.cmc.fashion_store.service.PaymentService;
import jakarta.persistence.EntityNotFoundException; // Import Exception
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime; // Import LocalDateTime
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository; // Inject OrderRepository

    @Override
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
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
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Đơn hàng với ID: " + request.getOrderId()));

        // 2. Chuyển đổi từ DTO sang Entity
        Payment newPayment = new Payment();
        newPayment.setOrder(order);
        newPayment.setPaymentMethod(request.getPaymentMethod());
        newPayment.setAmount(request.getAmount());
        newPayment.setPaymentDate(LocalDateTime.now()); // Tự động lấy ngày giờ hiện tại

        // 3. Lưu vào database
        return paymentRepository.save(newPayment);
    }
}