package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.PromotionRequestDTO;
import com.cmc.fashion_store.dto.PromotionReponseDTO;
import com.cmc.fashion_store.service.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/promotions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPromotions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        try {
            Pageable pageable = PageRequest.of(page, size,
                    sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

            Page<PromotionReponseDTO> promotionsPage = promotionService.getAllPromotions(pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", promotionsPage.getContent());
            response.put("currentPage", promotionsPage.getNumber());
            response.put("totalItems", promotionsPage.getTotalElements());
            response.put("totalPages", promotionsPage.getTotalPages());
            response.put("size", promotionsPage.getSize());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse("Lỗi khi lấy danh sách khuyến mãi", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchPromotions(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        try {
            Pageable pageable = PageRequest.of(page, size,
                    sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

            Page<PromotionReponseDTO> promotionsPage = promotionService.searchPromotions(keyword, type, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", promotionsPage.getContent());
            response.put("currentPage", promotionsPage.getNumber());
            response.put("totalItems", promotionsPage.getTotalElements());
            response.put("totalPages", promotionsPage.getTotalPages());
            response.put("size", promotionsPage.getSize());
            response.put("keyword", keyword);
            response.put("type", type);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse("Lỗi khi tìm kiếm khuyến mãi", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPromotion(
            @Valid @RequestBody PromotionRequestDTO promotionRequestDTO) {

        try {
            PromotionReponseDTO createdPromotion = promotionService.createPromotion(promotionRequestDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Thêm khuyến mãi thành công");
            response.put("data", createdPromotion);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return buildErrorResponse("Lỗi khi thêm khuyến mãi", e, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePromotion(
            @PathVariable Long id,
            @Valid @RequestBody PromotionRequestDTO promotionRequestDTO) {

        try {
            PromotionReponseDTO updatedPromotion = promotionService.updatePromotion(id, promotionRequestDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật khuyến mãi thành công");
            response.put("data", updatedPromotion);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse("Lỗi khi cập nhật khuyến mãi", e, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePromotion(@PathVariable Long id) {
        try {
            promotionService.deletePromotion(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xoá khuyến mãi thành công");
            response.put("id", id);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse("Lỗi khi xoá khuyến mãi", e, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPromotionById(@PathVariable Long id) {
        try {
            PromotionReponseDTO promotion = promotionService.getPromotionById(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", promotion);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse("Lỗi khi lấy thông tin khuyến mãi", e, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<Map<String, Object>> getPromotionsByType(@PathVariable String type) {
        try {
            List<PromotionReponseDTO> promotions = promotionService.getPromotionsByType(type);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", promotions);
            response.put("total", promotions.size());
            response.put("type", type);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse("Lỗi khi lấy khuyến mãi theo loại", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActivePromotions() {
        try {
            List<PromotionReponseDTO> promotions = promotionService.getActivePromotions();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", promotions);
            response.put("total", promotions.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse("Lỗi khi lấy khuyến mãi còn hiệu lực", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/expiring-soon")
    public ResponseEntity<Map<String, Object>> getExpiringSoonPromotions() {
        try {
            List<PromotionReponseDTO> promotions = promotionService.getExpiringSoonPromotions();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", promotions);
            response.put("total", promotions.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse("Lỗi khi lấy khuyến mãi sắp hết hạn", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/check-name/{name}")
    public ResponseEntity<Map<String, Object>> checkPromotionName(
            @PathVariable String name,
            @RequestParam(required = false) Long excludeId) {

        try {
            boolean exists = (excludeId != null) ?
                    promotionService.checkPromotionNameExists(name, excludeId) :
                    promotionService.checkPromotionNameExists(name);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("name", name);
            response.put("exists", exists);
            response.put("available", !exists);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse("Lỗi khi kiểm tra tên khuyến mãi", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(String error, Exception e, HttpStatus status) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("error", error);
        errorResponse.put("message", e.getMessage());
        return ResponseEntity.status(status).body(errorResponse);
    }
}
