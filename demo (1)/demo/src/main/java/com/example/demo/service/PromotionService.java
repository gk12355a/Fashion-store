package com.example.demo.service;

import com.example.demo.dto.PromotionRequestDTO;
import com.example.demo.dto.PromotionResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PromotionService {
    Page<PromotionResponseDTO> getAllPromotions(Pageable pageable);
    Page<PromotionResponseDTO> searchPromotions(String keyword, String type, Pageable pageable);
    PromotionResponseDTO createPromotion(PromotionRequestDTO requestDTO);
    PromotionResponseDTO updatePromotion(Long id, PromotionRequestDTO requestDTO);
    void deletePromotion(Long id);
    PromotionResponseDTO getPromotionById(Long id);
    List<PromotionResponseDTO> getPromotionsByType(String type);
    List<PromotionResponseDTO> getActivePromotions();
    List<PromotionResponseDTO> getExpiringSoonPromotions();
    boolean checkPromotionNameExists(String name);
    boolean checkPromotionNameExists(String name, Long excludeId);
}