package com.cmc.fashion_store.repository;

import com.cmc.fashion_store.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    /**
     * Tìm kiếm khuyến mãi theo Tên hoặc Loại (không phân biệt chữ hoa/thường)
     * và trả về kết quả dưới dạng trang (Page).
     * @param name Tên khuyến mãi để tìm kiếm.
     * @param type Loại khuyến mãi để tìm kiếm.
     * @param pageable Thông tin phân trang và sắp xếp.
     * @return Một trang các khuyến mãi phù hợp.
     */
    Page<Promotion> findByNameContainingIgnoreCaseOrTypeContainingIgnoreCase(String name, String type, Pageable pageable);
}