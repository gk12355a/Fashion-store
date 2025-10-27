package com.cmc.fashion_store.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderDetailResponse {
    private Long id;
    private int quantity;
    private BigDecimal unitPrice;
    private Long orderId;
    private Long productId;
    private String productName;
}