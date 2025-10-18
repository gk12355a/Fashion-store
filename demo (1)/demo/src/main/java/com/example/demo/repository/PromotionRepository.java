package com.example.demo.repository;

import com.example.demo.model.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    @Query("SELECT p FROM Promotion p WHERE " +
            "(:keyword IS NULL OR p.name LIKE %:keyword%) AND " +
            "(:type IS NULL OR p.type = :type)")
    Page<Promotion> searchPromotions(@Param("keyword") String keyword,
                                     @Param("type") String type,
                                     Pageable pageable);

    List<Promotion> findByType(String type);

    @Query("SELECT p FROM Promotion p WHERE p.expiryDate > CURRENT_TIMESTAMP")
    List<Promotion> findActivePromotions();

    @Query("SELECT p FROM Promotion p WHERE p.expiryDate BETWEEN CURRENT_TIMESTAMP AND :futureDate")
    List<Promotion> findExpiringSoonPromotions(@Param("futureDate") LocalDateTime futureDate);

    boolean existsByName(String name);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Promotion p WHERE p.name = :name AND p.id != :id")
    boolean existsByNameAndIdNot(@Param("name") String name, @Param("id") Long id);
}