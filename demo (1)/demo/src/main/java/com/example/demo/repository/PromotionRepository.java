package com.example.demo.repository;

import com.example.demo.entity.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    // Sửa query - bỏ điều kiện không cần thiết
    @Query("SELECT p FROM Promotion p WHERE " +
            "(:keyword IS NULL OR p.name LIKE %:keyword%) AND " +
            "(:type IS NULL OR p.type = :type)")
    Page<Promotion> searchPromotions(@Param("keyword") String keyword,
                                     @Param("type") String type,
                                     Pageable pageable);

    // Tìm khuyến mãi theo loại
    List<Promotion> findByType(String type);

    // Tìm khuyến mãi còn hiệu lực - SỬA QUERY NÀY
    @Query("SELECT p FROM Promotion p WHERE p.expiryDate > CURRENT_TIMESTAMP")
    List<Promotion> findActivePromotions();

    // Tìm khuyến mãi sắp hết hạn - SỬA QUERY NÀY
    @Query("SELECT p FROM Promotion p WHERE p.expiryDate BETWEEN CURRENT_TIMESTAMP AND :futureDate")
    List<Promotion> findExpiringSoonPromotions(@Param("futureDate") java.time.LocalDateTime futureDate);

    // Kiểm tra trùng tên
    boolean existsByName(String name);

    // Kiểm tra trùng tên trừ chính ID hiện tại
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Promotion p WHERE p.name = :name AND p.id != :id")
    boolean existsByNameAndIdNot(@Param("name") String name, @Param("id") Long id);
}