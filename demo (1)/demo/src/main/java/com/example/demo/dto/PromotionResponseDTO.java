package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PromotionResponseDTO {
    private Long id;
    private String name;
    private Double discountValue;
    private LocalDateTime expiryDate;
    private String type;
    private String description;
    private String status;
}