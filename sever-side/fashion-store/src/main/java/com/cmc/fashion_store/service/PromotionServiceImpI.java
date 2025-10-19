package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.PromotionRequestDTO;
import com.cmc.fashion_store.dto.PromotionReponseDTO;
import com.cmc.fashion_store.model.Promotion;
import com.cmc.fashion_store.repository.PromotionRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<PromotionReponseDTO> getAllPromotions(Pageable pageable) {
        return promotionRepository.findAll(pageable).map(this::convertToResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PromotionReponseDTO> searchPromotions(String keyword, String type, Pageable pageable) {
        return promotionRepository.searchPromotions(keyword, type, pageable)
                .map(this::convertToResponseDTO);
    }

    @Override
    public PromotionReponseDTO createPromotion(@Valid PromotionRequestDTO requestDTO) {
        if (promotionRepository.existsByName(requestDTO.getName())) {
            throw new RuntimeException("Tên khuyến mãi '" + requestDTO.getName() + "' đã tồn tại");
        }

        validatePromotionDate(requestDTO.getExpiryDate());

        Promotion promotion = convertToEntity(requestDTO);
        promotion.setStatus("ACTIVE");
        Promotion savedPromotion = promotionRepository.save(promotion);

        return convertToResponseDTO(savedPromotion);
    }

    @Override
    public PromotionReponseDTO updatePromotion(Long id, PromotionRequestDTO requestDTO) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khuyến mãi với ID " + id + " không tồn tại"));

        if (!promotion.getName().equals(requestDTO.getName()) &&
                promotionRepository.existsByNameAndIdNot(requestDTO.getName(), id)) {
            throw new RuntimeException("Tên khuyến mãi '" + requestDTO.getName() + "' đã tồn tại");
        }

        validatePromotionDate(requestDTO.getExpiryDate());

        promotion.setName(requestDTO.getName());
        promotion.setDiscountValue(requestDTO.getDiscountValue());
        promotion.setExpiryDate(requestDTO.getExpiryDate());
        promotion.setType(requestDTO.getType());
        promotion.setDescription(requestDTO.getDescription());

        Promotion updatedPromotion = promotionRepository.save(promotion);
        return convertToResponseDTO(updatedPromotion);
    }

    @Override
    public void deletePromotion(Long id) {
        if (!promotionRepository.existsById(id)) {
            throw new RuntimeException("Khuyến mãi với ID " + id + " không tồn tại");
        }
        promotionRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public PromotionReponseDTO getPromotionById(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khuyến mãi với ID " + id + " không tồn tại"));
        return convertToResponseDTO(promotion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromotionReponseDTO> getPromotionsByType(String type) {
        return promotionRepository.findByType(type)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromotionReponseDTO> getActivePromotions() {
        return promotionRepository.findActivePromotions()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromotionReponseDTO> getExpiringSoonPromotions() {
        LocalDateTime futureDate = LocalDateTime.now().plusDays(7);
        return promotionRepository.findExpiringSoonPromotions(futureDate)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkPromotionNameExists(String name) {
        return promotionRepository.existsByName(name);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkPromotionNameExists(String name, Long excludeId) {
        return promotionRepository.existsByNameAndIdNot(name, excludeId);
    }

    private void validatePromotionDate(LocalDateTime expiryDate) {
        if (expiryDate.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Ngày hết hạn phải là tương lai");
        }
    }

    private Promotion convertToEntity(PromotionRequestDTO dto) {
        Promotion promotion = new Promotion();
        promotion.setName(dto.getName());
        promotion.setDiscountValue(dto.getDiscountValue());
        promotion.setExpiryDate(dto.getExpiryDate());
        promotion.setType(dto.getType());
        promotion.setDescription(dto.getDescription());
        return promotion;
    }

    private PromotionReponseDTO convertToResponseDTO(Promotion promotion) {
        PromotionReponseDTO dto = new PromotionReponseDTO();
        dto.setId(promotion.getId());
        dto.setName(promotion.getName());
        dto.setDiscountValue(promotion.getDiscountValue());
        dto.setExpiryDate(promotion.getExpiryDate());
        dto.setType(promotion.getType());
        dto.setDescription(promotion.getDescription());
        dto.setStatus(promotion.getStatus());
        return dto;
    }
}
