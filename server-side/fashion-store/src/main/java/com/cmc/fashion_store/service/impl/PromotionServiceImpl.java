package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.PromotionResponse;
import com.cmc.fashion_store.dto.UpdatePromotionRequest;
import com.cmc.fashion_store.model.Promotion;
import com.cmc.fashion_store.repository.PromotionRepository;
import com.cmc.fashion_store.service.PromotionService;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.cmc.fashion_store.dto.CreatePromotionRequest;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;

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

    @Override
    @Transactional
    public PromotionResponse createPromotion(CreatePromotionRequest request) {
        // 1. Chuyển đổi từ DTO sang Entity
        Promotion newPromotion = new Promotion();
        newPromotion.setName(request.getName());
        newPromotion.setType(request.getType());
        newPromotion.setDiscountValue(request.getDiscountValue());
        newPromotion.setExpiryDate(request.getExpiryDate());

        // 2. Lưu vào database
        Promotion savedPromotion = promotionRepository.save(newPromotion);

        // 3. Chuyển đổi sang DTO để trả về cho client
        return convertToDto(savedPromotion);
    }

    @Override
    @Transactional
    public void deletePromotion(Long id) {
        // 1. Kiểm tra xem khuyến mãi có tồn tại không
        if (!promotionRepository.existsById(id)) {
            // Nếu không tìm thấy, ném ra một exception để báo lỗi
            throw new EntityNotFoundException("Không tìm thấy khuyến mãi với ID: " + id);
        }
        // 2. Nếu tồn tại, tiến hành xóa
        promotionRepository.deleteById(id);
    }
    @Override
    @Transactional
    public PromotionResponse updatePromotion(Long id, UpdatePromotionRequest request) {
        // 1. Tìm khuyến mãi trong DB, nếu không thấy thì báo lỗi
        Promotion existingPromotion = promotionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khuyến mãi với ID: " + id));

        // 2. Cập nhật thông tin từ DTO vào entity đã tồn tại
        existingPromotion.setName(request.getName());
        existingPromotion.setType(request.getType());
        existingPromotion.setDiscountValue(request.getDiscountValue());
        existingPromotion.setExpiryDate(request.getExpiryDate());

        // 3. Lưu lại vào DB
        Promotion updatedPromotion = promotionRepository.save(existingPromotion);

        // 4. Chuyển đổi sang DTO để trả về
        return convertToDto(updatedPromotion);
    }
    @Override
    @Transactional(readOnly = true) // readOnly = true để tối ưu hiệu năng cho các truy vấn chỉ đọc
    public Page<PromotionResponse> searchPromotions(String keyword, Pageable pageable) {
        // Gọi phương thức repository mới, truyền keyword cho cả 2 tham số name và type
        Page<Promotion> promotionPage = promotionRepository.findByNameContainingIgnoreCaseOrTypeContainingIgnoreCase(keyword, keyword, pageable);
        return promotionPage.map(this::convertToDto);
    }
    @Override
    @Transactional(readOnly = true)
    public List<Promotion> searchActivePromotions(String query) {
        // Giới hạn 10 kết quả (cho autocomplete)
        Pageable limit = PageRequest.of(0, 10); 
        LocalDate currentDate = LocalDate.now();
        
        // Gọi hàm repository (từ File 12)
        return promotionRepository.searchActivePromotions(query, currentDate, limit);
    }

    // --- IMPLEMENT PHƯƠNG THỨC MỚI ---
    @Override
    @Transactional(readOnly = true)
    public List<String> getPromotionSuggestions(String query) {
        Pageable limit = PageRequest.of(0, 5); // Lấy 5 gợi ý
        return promotionRepository.findSuggestionByNameOrType(query, limit);
    }
}