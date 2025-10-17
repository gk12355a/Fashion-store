package com.cmc.fashion_store.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentResponse {
    private Long id;
    private Long orderId; // Mã đơn
    private String paymentMethod; // Phương thức
    private BigDecimal amount; // Số tiền
    private LocalDateTime paymentDate; // Ngày TT
}