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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    public Page<PromotionResponseDTO> getAllPromotions(Pageable pageable) {
        return promotionRepository.findAll(pageable)
                .map(this::convertToResponseDTO);
    }

    public Page<PromotionResponseDTO> searchPromotions(String keyword, String type, Pageable pageable) {
        return promotionRepository.searchPromotions(keyword, type, pageable)
                .map(this::convertToResponseDTO);
    }

    public PromotionResponseDTO createPromotion(PromotionRequestDTO requestDTO) {
        // Kiểm tra tên đã tồn tại
        if (promotionRepository.existsByName(requestDTO.getName())) {
            throw new RuntimeException("Tên khuyến mãi '" + requestDTO.getName() + "' đã tồn tại");
        }

        validatePromotionDate(requestDTO.getExpiryDate());

        Promotion promotion = convertToEntity(requestDTO);
        Promotion savedPromotion = promotionRepository.save(promotion);

        return convertToResponseDTO(savedPromotion);
    }

    public PromotionResponseDTO updatePromotion(Long id, PromotionRequestDTO requestDTO) {
        Optional<Promotion> optionalPromotion = promotionRepository.findById(id);

        if (optionalPromotion.isPresent()) {
            Promotion promotion = optionalPromotion.get();

            // Kiểm tra tên (trừ id hiện tại)
            if (!promotion.getName().equals(requestDTO.getName()) &&
                    promotionRepository.existsByNameAndIdNot(requestDTO.getName(), id)) {
                throw new RuntimeException("Tên khuyến mãi '" + requestDTO.getName() + "' đã tồn tại");
            }

            validatePromotionDate(requestDTO.getExpiryDate());

            // Cập nhật thông tin
            promotion.setName(requestDTO.getName());
            promotion.setDiscountValue(requestDTO.getDiscountValue());
            promotion.setExpiryDate(requestDTO.getExpiryDate());
            promotion.setType(requestDTO.getType());

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

    public List<PromotionResponseDTO> getPromotionsByType(String type) {
        return promotionRepository.findByType(type)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<PromotionResponseDTO> getActivePromotions() {
        return promotionRepository.findActivePromotions()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<PromotionResponseDTO> getExpiringSoonPromotions() {
        // Sửa lại logic cho query expiring soon
        LocalDateTime futureDate = LocalDateTime.now().plusDays(7);
        return promotionRepository.findExpiringSoonPromotions(futureDate)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public boolean checkPromotionNameExists(String name) {
        return promotionRepository.existsByName(name);
    }

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
        return promotion;
    }

    private PromotionResponseDTO convertToResponseDTO(Promotion promotion) {
        PromotionResponseDTO dto = new PromotionResponseDTO();
        dto.setId(promotion.getId());
        dto.setName(promotion.getName());
        dto.setDiscountValue(promotion.getDiscountValue());
        dto.setExpiryDate(promotion.getExpiryDate());
        dto.setType(promotion.getType());
        return dto;
    }
}