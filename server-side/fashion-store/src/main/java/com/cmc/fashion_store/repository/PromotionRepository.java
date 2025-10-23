package com.cmc.fashion_store.repository;

import com.cmc.fashion_store.model.Promotion;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    // (Giữ lại phương thức cũ mà PromotionServiceImpl đang dùng)
    Page<Promotion> findByNameContainingIgnoreCaseOrTypeContainingIgnoreCase(String name, String type, Pageable pageable);


    // --- 5. SỬA LẠI PHƯƠNG THỨC MỚI ---
    /**
     * Tìm kiếm các khuyến mãi còn hạn sử dụng (hoặc không có hạn)
     * dựa trên TÊN (name) hoặc LOẠI (type).
     *
     * @param query Từ khóa tìm kiếm
     * @param currentDate Ngày hiện tại (để so sánh ExpiryDate)
     * @param pageable Giới hạn số lượng kết quả
     * @return Danh sách Promotion (Entity)
     */
    @Query("SELECT p FROM Promotion p WHERE " +
           // --- SỬA 'p.code' THÀNH 'p.type' ---
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.type) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           // ---------------------------------
           "AND (p.expiryDate IS NULL OR p.expiryDate >= :currentDate)")
    List<Promotion> searchActivePromotions(
            @Param("query") String query,
            @Param("currentDate") LocalDate currentDate,
            Pageable pageable
    );
    // --- PHƯƠNG THỨC MỚI CHO AUTOCOMPLETE ---
    /**
     * Tìm gợi ý Khuyến mãi theo Tên hoặc Loại.
     * Trả về chuỗi dạng "Tên (Loại: X)"
     */
    @Query("SELECT CONCAT(p.name, ' (Loại: ', p.type, ')') FROM Promotion p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.type) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<String> findSuggestionByNameOrType(@Param("query") String query, Pageable pageable);
}