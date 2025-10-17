package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.PaymentResponse;
import com.cmc.fashion_store.model.Payment;
import com.cmc.fashion_store.repository.PaymentRepository;
import com.cmc.fashion_store.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

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
}