package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.PromotionRequestDTO;
import com.cmc.fashion_store.dto.PromotionReponseDTO;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PromotionService {

    Page<PromotionReponseDTO> getAllPromotions(Pageable pageable);

    Page<PromotionReponseDTO> searchPromotions(String keyword, String type, Pageable pageable);

    PromotionReponseDTO createPromotion(@Valid PromotionRequestDTO requestDTO);

    PromotionReponseDTO updatePromotion(Long id, PromotionRequestDTO requestDTO);

    void deletePromotion(Long id);

    PromotionReponseDTO getPromotionById(Long id);

    List<PromotionReponseDTO> getPromotionsByType(String type);

    List<PromotionReponseDTO> getActivePromotions();

    List<PromotionReponseDTO> getExpiringSoonPromotions();

    boolean checkPromotionNameExists(String name);

    boolean checkPromotionNameExists(String name, Long excludeId);
}
