package com.cmc.fashion_store.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private LocalDateTime orderDate;
    private String status;
    private BigDecimal totalAmount;
    private Long customerId; // <-- Trường quan trọng bị thiếu
    private List<OrderDetailResponse> orderDetails; // <-- Sẽ chứa danh sách DTO chi tiết đơn
}