package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.CreatePromotionRequest; // Thêm import này
import com.cmc.fashion_store.dto.PromotionResponse;
import com.cmc.fashion_store.dto.UpdatePromotionRequest;
import com.cmc.fashion_store.model.Promotion;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PromotionService {

    /**
     * Lấy danh sách khuyến mãi có phân trang và sắp xếp.
     * @param pageable đối tượng chứa thông tin phân trang và sắp xếp.
     * @return một trang (Page) chứa danh sách PromotionResponse.
     */
    Page<PromotionResponse> getAllPromotions(Pageable pageable);
    /**
     * Tạo một chương trình khuyến mãi mới.
     * @param request thông tin khuyến mãi cần tạo.
     * @return PromotionResponse của khuyến mãi vừa được tạo.
     */
    PromotionResponse createPromotion(CreatePromotionRequest request);
    /**
     * Xóa một chương trình khuyến mãi dựa vào ID.
     * @param id ID của khuyến mãi cần xóa.
     */
    void deletePromotion(Long id);
    /**
     * Cập nhật thông tin một chương trình khuyến mãi.
     * @param id ID của khuyến mãi cần cập nhật.
     * @param request Đối tượng chứa thông tin mới.
     * @return PromotionResponse đã được cập nhật.
     */
    PromotionResponse updatePromotion(Long id, UpdatePromotionRequest request);
    /**
     * Tìm kiếm khuyến mãi theo từ khóa.
     * @param keyword Từ khóa để tìm kiếm trong Tên hoặc Loại.
     * @param pageable Thông tin phân trang.
     * @return Một trang các khuyến mãi phù hợp.
     */
    Page<PromotionResponse> searchPromotions(String keyword, Pageable pageable);
    List<Promotion> searchActivePromotions(String query);
    // --- THÊM PHƯƠNG THỨC MỚI ---
    /**
     * Lấy gợi ý cho tìm kiếm Khuyến mãi (theo Tên hoặc Loại).
     */
    List<String> getPromotionSuggestions(String query);
}