package com.example.demo.service;

import com.example.demo.dto.PromotionRequestDTO;
import com.example.demo.dto.PromotionResponseDTO;
import com.example.demo.entity.Promotion;
import com.example.demo.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    public Page<PromotionResponseDTO> getAllPromotions(Pageable pageable) {
        return promotionRepository.findAll(pageable)
                .map(this::convertToResponseDTO);
    }

    public Page<PromotionResponseDTO> searchPromotions(String keyword, Boolean isActive, Pageable pageable) {
        return promotionRepository.searchPromotions(keyword, isActive, pageable)
                .map(this::convertToResponseDTO);
    }

    public PromotionResponseDTO createPromotion(PromotionRequestDTO requestDTO) {
        // Kiểm tra mã đã tồn tại
        if (promotionRepository.existsByCode(requestDTO.getCode())) {
            throw new RuntimeException("Mã khuyến mãi '" + requestDTO.getCode() + "' đã tồn tại");
        }

        validatePromotionDates(requestDTO.getStartDate(), requestDTO.getEndDate());

        Promotion promotion = convertToEntity(requestDTO);
        Promotion savedPromotion = promotionRepository.save(promotion);

        return convertToResponseDTO(savedPromotion);
    }

    public PromotionResponseDTO updatePromotion(Long id, PromotionRequestDTO requestDTO) {
        Optional<Promotion> optionalPromotion = promotionRepository.findById(id);

        if (optionalPromotion.isPresent()) {
            Promotion promotion = optionalPromotion.get();

            // Kiểm tra mã (trừ id hiện tại)
            if (!promotion.getCode().equals(requestDTO.getCode()) &&
                    promotionRepository.existsByCodeAndIdNot(requestDTO.getCode(), id)) {
                throw new RuntimeException("Mã khuyến mãi '" + requestDTO.getCode() + "' đã tồn tại");
            }

            validatePromotionDates(requestDTO.getStartDate(), requestDTO.getEndDate());

            // Cập nhật thông tin
            promotion.setName(requestDTO.getName());
            promotion.setCode(requestDTO.getCode());
            promotion.setDescription(requestDTO.getDescription());
            promotion.setDiscountValue(requestDTO.getDiscountValue());
            promotion.setDiscountType(requestDTO.getDiscountType());
            promotion.setStartDate(requestDTO.getStartDate());
            promotion.setEndDate(requestDTO.getEndDate());
            promotion.setUsageLimit(requestDTO.getUsageLimit());
            promotion.setIsActive(requestDTO.getIsActive());

            Promotion updatedPromotion = promotionRepository.save(promotion);
            return convertToResponseDTO(updatedPromotion);

        } else {
            throw new RuntimeException("Khuyến mãi với ID " + id + " không tồn tại");
        }
    }

    public void deletePromotion(Long id) {
        if (promotionRepository.existsById(id)) {
            promotionRepository.deleteById(id);
        } else {
            throw new RuntimeException("Khuyến mãi với ID " + id + " không tồn tại");
        }
    }

    public PromotionResponseDTO getPromotionById(Long id) {
        Optional<Promotion> promotion = promotionRepository.findById(id);
        return promotion.map(this::convertToResponseDTO)
                .orElseThrow(() -> new RuntimeException("Khuyến mãi với ID " + id + " không tồn tại"));
    }

    public boolean checkPromotionCodeExists(String code) {
        return promotionRepository.existsByCode(code);
    }

    public boolean checkPromotionCodeExists(String code, Long excludeId) {
        return promotionRepository.existsByCodeAndIdNot(code, excludeId);
    }

    private void validatePromotionDates(LocalDateTime startDate, LocalDateTime endDate) {
        if (endDate.isBefore(startDate)) {
            throw new RuntimeException("Ngày kết thúc phải sau ngày bắt đầu");
        }

        if (startDate.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Ngày bắt đầu không được ở quá khứ");
        }
    }

    private Promotion convertToEntity(PromotionRequestDTO dto) {
        Promotion promotion = new Promotion();
        promotion.setName(dto.getName());
        promotion.setCode(dto.getCode());
        promotion.setDescription(dto.getDescription());
        promotion.setDiscountValue(dto.getDiscountValue());
        promotion.setDiscountType(dto.getDiscountType());
        promotion.setStartDate(dto.getStartDate());
        promotion.setEndDate(dto.getEndDate());
        promotion.setUsageLimit(dto.getUsageLimit());
        promotion.setIsActive(dto.getIsActive());
        return promotion;
    }

    private PromotionResponseDTO convertToResponseDTO(Promotion promotion) {
        PromotionResponseDTO dto = new PromotionResponseDTO();
        dto.setId(promotion.getId());
        dto.setName(promotion.getName());
        dto.setCode(promotion.getCode());
        dto.setDescription(promotion.getDescription());
        dto.setDiscountValue(promotion.getDiscountValue());
        dto.setDiscountType(promotion.getDiscountType());
        dto.setStartDate(promotion.getStartDate());
        dto.setEndDate(promotion.getEndDate());
        dto.setUsageLimit(promotion.getUsageLimit());
        dto.setUsedCount(promotion.getUsedCount());
        dto.setIsActive(promotion.getIsActive());
        dto.setCreatedAt(promotion.getCreatedAt());
        dto.setUpdatedAt(promotion.getUpdatedAt());
        return dto;
    }
}