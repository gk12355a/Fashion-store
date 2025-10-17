package com.example.demo.repository;

import com.example.demo.entity.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    @Query("SELECT p FROM Promotion p WHERE " +
            "(:keyword IS NULL OR p.name LIKE %:keyword% OR p.code LIKE %:keyword% OR p.description LIKE %:keyword%) " +
            "AND (:isActive IS NULL OR p.isActive = :isActive)")
    Page<Promotion> searchPromotions(@Param("keyword") String keyword,
                                     @Param("isActive") Boolean isActive,
                                     Pageable pageable);

    Optional<Promotion> findByCode(String code);

    boolean existsByCode(String code);

    @Query("SELECT COUNT(p) > 0 FROM Promotion p WHERE p.code = :code AND p.id != :id")
    boolean existsByCodeAndIdNot(@Param("code") String code, @Param("id") Long id);
}