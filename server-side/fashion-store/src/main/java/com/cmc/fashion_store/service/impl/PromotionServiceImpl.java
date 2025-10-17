package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.PromotionResponse;
import com.cmc.fashion_store.model.Promotion;
import com.cmc.fashion_store.repository.PromotionRepository;
import com.cmc.fashion_store.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;

    @Autowired
    public PromotionServiceImpl(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    @Override
    public Page<PromotionResponse> getAllPromotions(Pageable pageable) {
        Page<Promotion> promotionPage = promotionRepository.findAll(pageable);
        return promotionPage.map(this::convertToDto);
    }

    // Hàm helper để chuyển đổi Entity sang DTO
    private PromotionResponse convertToDto(Promotion promotion) {
        PromotionResponse dto = new PromotionResponse();
        dto.setId(promotion.getId());
        dto.setName(promotion.getName());
        dto.setType(promotion.getType());
        dto.setDiscountValue(promotion.getDiscountValue());
        dto.setExpiryDate(promotion.getExpiryDate()); // Cập nhật để lấy từ expiryDate
        return dto;
    }
}