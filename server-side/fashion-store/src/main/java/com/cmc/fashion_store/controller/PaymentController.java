package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.CreatePaymentRequest;
import com.cmc.fashion_store.dto.PaymentResponse;
import com.cmc.fashion_store.model.Payment;
import com.cmc.fashion_store.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/payments") // -> /api/v1/payments
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        List<PaymentResponse> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
    // API này sẽ xử lý yêu cầu POST đến /api/v1/payments
    @PostMapping
    public ResponseEntity<Payment> createPayment(@Valid @RequestBody CreatePaymentRequest request) {
        Payment createdPayment = paymentService.createPayment(request);
        return new ResponseEntity<>(createdPayment, HttpStatus.CREATED);
    }
    // API này sẽ xử lý yêu cầu DELETE đến /api/v1/payments/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        // Trả về status 204 No Content, báo hiệu xóa thành công
        return ResponseEntity.noContent().build();
    }
}