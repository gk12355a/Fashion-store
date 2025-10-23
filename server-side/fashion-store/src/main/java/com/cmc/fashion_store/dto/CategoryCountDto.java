package com.cmc.fashion_store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryCountDto {
    private String category; // Corresponds to product 'type'
    private Long count;    // Count of products in this category
}