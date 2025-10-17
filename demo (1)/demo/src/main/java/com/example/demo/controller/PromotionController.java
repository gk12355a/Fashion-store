package com.example.demo.controller;

import com.example.demo.dto.PromotionRequestDTO;
import com.example.demo.dto.PromotionResponseDTO;
import com.example.demo.service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/promotions")
@CrossOrigin(origins = "*")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    // Lấy danh sách tất cả khuyến mãi với pagination và sort
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPromotions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        try {
            Pageable pageable = PageRequest.of(page, size,
                    sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

            Page<PromotionResponseDTO> promotionsPage = promotionService.getAllPromotions(pageable);

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

    // Tìm kiếm khuyến mãi theo keyword và trạng thái
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchPromotions(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        try {
            Pageable pageable = PageRequest.of(page, size,
                    sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

            Page<PromotionResponseDTO> promotionsPage = promotionService.searchPromotions(keyword, isActive, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", promotionsPage.getContent());
            response.put("currentPage", promotionsPage.getNumber());
            response.put("totalItems", promotionsPage.getTotalElements());
            response.put("totalPages", promotionsPage.getTotalPages());
            response.put("size", promotionsPage.getSize());
            response.put("keyword", keyword);
            response.put("isActive", isActive);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse("Lỗi khi tìm kiếm khuyến mãi", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Thêm khuyến mãi mới
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPromotion(
            @Valid @RequestBody PromotionRequestDTO promotionRequestDTO) {

        try {
            PromotionResponseDTO createdPromotion = promotionService.createPromotion(promotionRequestDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Thêm khuyến mãi thành công");
            response.put("data", createdPromotion);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return buildErrorResponse("Lỗi khi thêm khuyến mãi", e, HttpStatus.BAD_REQUEST);
        }
    }

    // Cập nhật khuyến mãi
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePromotion(
            @PathVariable Long id,
            @Valid @RequestBody PromotionRequestDTO promotionRequestDTO) {

        try {
            PromotionResponseDTO updatedPromotion = promotionService.updatePromotion(id, promotionRequestDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật khuyến mãi thành công");
            response.put("data", updatedPromotion);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse("Lỗi khi cập nhật khuyến mãi", e, HttpStatus.BAD_REQUEST);
        }
    }

    // Xoá khuyến mãi
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

    // Lấy khuyến mãi theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPromotionById(@PathVariable Long id) {
        try {
            PromotionResponseDTO promotion = promotionService.getPromotionById(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", promotion);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse("Lỗi khi lấy thông tin khuyến mãi", e, HttpStatus.NOT_FOUND);
        }
    }

    // Kiểm tra mã khuyến mãi
    @GetMapping("/check-code/{code}")
    public ResponseEntity<Map<String, Object>> checkPromotionCode(
            @PathVariable String code,
            @RequestParam(required = false) Long excludeId) {

        try {
            boolean exists = (excludeId != null) ?
                    promotionService.checkPromotionCodeExists(code, excludeId) :
                    promotionService.checkPromotionCodeExists(code);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("code", code);
            response.put("exists", exists);
            response.put("available", !exists);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse("Lỗi khi kiểm tra mã khuyến mãi", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Hàm tiện ích trả về lỗi
    private ResponseEntity<Map<String, Object>> buildErrorResponse(String error, Exception e, HttpStatus status) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("error", error);
        errorResponse.put("message", e.getMessage());
        return ResponseEntity.status(status).body(errorResponse);
    }
}