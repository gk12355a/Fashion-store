package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.PromotionResponse;
import com.cmc.fashion_store.dto.UpdatePromotionRequest;
import com.cmc.fashion_store.model.Promotion;
import com.cmc.fashion_store.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.cmc.fashion_store.dto.CreatePromotionRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springdoc.core.annotations.ParameterObject; // <-- THÊM IMPORT NÀY
@RestController
@RequestMapping("${api.prefix}/promotions") // -> /api/v1/promotions
public class PromotionController {

    private final PromotionService promotionService;

    @Autowired
    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @GetMapping
    public ResponseEntity<Page<PromotionResponse>> getAllPromotions(@ParameterObject Pageable pageable) {
        Page<PromotionResponse> promotions = promotionService.getAllPromotions(pageable);
        return ResponseEntity.ok(promotions);
    }
    @PostMapping
    public ResponseEntity<PromotionResponse> createPromotion(@Valid @RequestBody CreatePromotionRequest request) {
        PromotionResponse createdPromotion = promotionService.createPromotion(request);
        return new ResponseEntity<>(createdPromotion, HttpStatus.CREATED);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
        // Trả về status 204 No Content, báo hiệu xóa thành công và không có nội dung trả về
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}")
    public ResponseEntity<PromotionResponse> updatePromotion(@PathVariable Long id, @Valid @RequestBody UpdatePromotionRequest request) {
        PromotionResponse updatedPromotion = promotionService.updatePromotion(id, request);
        return ResponseEntity.ok(updatedPromotion);
    }
    @GetMapping("/search")
    public ResponseEntity<Page<PromotionResponse>> searchPromotions(
            @RequestParam String keyword,
            @ParameterObject Pageable pageable) {
        Page<PromotionResponse> promotions = promotionService.searchPromotions(keyword, pageable);
        return ResponseEntity.ok(promotions);
    }
    @GetMapping("/search-active")
    public ResponseEntity<List<Promotion>> searchActivePromotions(@RequestParam("q") String q) {
        List<Promotion> promotions = promotionService.searchActivePromotions(q);
        return ResponseEntity.ok(promotions);
    }
}