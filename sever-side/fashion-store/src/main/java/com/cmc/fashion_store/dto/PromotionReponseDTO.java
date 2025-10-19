package com.cmc.fashion_store.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PromotionReponseDTO {
    private Long id;
    private String name;
    private Double discountValue;
    private LocalDateTime expiryDate;
    private String type;
    private String description;
    private String status;
}