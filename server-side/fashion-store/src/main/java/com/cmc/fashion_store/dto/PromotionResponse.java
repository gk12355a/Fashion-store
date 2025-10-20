package com.cmc.fashion_store.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PromotionResponse {
    private Long id;
    private String name;
    private String type;
    private BigDecimal discountValue;
    private LocalDate expiryDate; // Cập nhật tên trường
}