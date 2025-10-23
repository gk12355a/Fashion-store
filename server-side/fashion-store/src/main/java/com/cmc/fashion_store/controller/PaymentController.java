package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.CreatePaymentRequest;
import com.cmc.fashion_store.dto.UpdatePaymentRequest; // Import DTO mới
import com.cmc.fashion_store.dto.PaymentResponse;
import com.cmc.fashion_store.model.Payment;
import com.cmc.fashion_store.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import org.springdoc.core.annotations.ParameterObject; // <-- THÊM IMPORT NÀY
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/payments") // -> /api/v1/payments
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // API này giờ sẽ nhận Pageable và trả về Page<DTO>
    @org.springframework.web.bind.annotation.GetMapping
    public ResponseEntity<Page<PaymentResponse>> getAllPayments(@ParameterObject Pageable pageable) {
        Page<PaymentResponse> paymentsPage = paymentService.getAllPayments(pageable);
        return ResponseEntity.ok(paymentsPage);
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
    // API này sẽ xử lý yêu cầu GET đến /api/v1/payments/search
    @GetMapping("/search")
    public ResponseEntity<List<PaymentResponse>> searchPayments(
            @RequestParam(required = false) Long orderId,
            @RequestParam(required = false) String paymentMethod) {
        List<PaymentResponse> payments = paymentService.searchPayments(orderId, paymentMethod);
        return ResponseEntity.ok(payments);
    }
    // API này giờ sẽ trả về DTO
    @PutMapping("/{id}")
    public ResponseEntity<PaymentResponse> updatePayment(@PathVariable Long id, @Valid @RequestBody UpdatePaymentRequest request) {
        PaymentResponse updatedPaymentDto = paymentService.updatePayment(id, request);
        return ResponseEntity.ok(updatedPaymentDto);
    }
    // --- THÊM ENDPOINT MỚI CHO AUTOCOMPLETE ---
    @GetMapping("/methods/autocomplete")
    public ResponseEntity<List<String>> getPaymentMethodSuggestions(@RequestParam("q") String query) {
        List<String> suggestions = paymentService.getPaymentMethodSuggestions(query);
        return ResponseEntity.ok(suggestions);
    }
}