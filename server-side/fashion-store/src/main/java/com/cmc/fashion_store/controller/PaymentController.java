package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.CreatePaymentRequest;
import com.cmc.fashion_store.dto.PaymentResponse;
import com.cmc.fashion_store.model.Payment;
import com.cmc.fashion_store.service.PaymentService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}