package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.CreatePromotionRequest; // Thêm import này
import com.cmc.fashion_store.dto.PromotionResponse;
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
}