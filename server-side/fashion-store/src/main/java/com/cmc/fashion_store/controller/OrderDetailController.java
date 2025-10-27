package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.CreateOrderDetailRequest; // Import DTO
import com.cmc.fashion_store.dto.UpdateOrderDetailRequest; // Import DTO mới
import com.cmc.fashion_store.dto.OrderDetailResponse; // Import DTO
// Bỏ import OrderDetail nếu không cần trả về Entity
// import com.cmc.fashion_store.model.OrderDetail;
import com.cmc.fashion_store.service.OrderDetailService;
import jakarta.validation.Valid; // Import cho @Valid
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import org.springdoc.core.annotations.ParameterObject; // Import cho Swagger
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/order-details") // -> /api/v1/order-details
public class OrderDetailController {

    @Autowired
    private OrderDetailService orderDetailService;

    @GetMapping
    public ResponseEntity<Page<OrderDetailResponse>> getAllOrderDetails(@ParameterObject Pageable pageable) {
        Page<OrderDetailResponse> orderDetailsPage = orderDetailService.getAllOrderDetails(pageable);
        return ResponseEntity.ok(orderDetailsPage);
    }

    // --- SỬA HÀM NÀY ---
    @PostMapping
    public ResponseEntity<OrderDetailResponse> createOrderDetail(@Valid @RequestBody CreateOrderDetailRequest request) { // <-- Sửa kiểu ResponseEntity
        // Gọi service trả về DTO
        OrderDetailResponse createdDto = orderDetailService.createOrderDetail(request);
        // Trả về DTO với status 201 CREATED
        return new ResponseEntity<>(createdDto, HttpStatus.CREATED);
    }
    // --- KẾT THÚC SỬA ---

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderDetail(@PathVariable Long id) {
        orderDetailService.deleteOrderDetail(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<OrderDetailResponse>> searchOrderDetails(
            @RequestParam(required = false) Long orderId,
            @RequestParam(required = false) Long productId) {
        List<OrderDetailResponse> orderDetails = orderDetailService.searchOrderDetails(orderId, productId);
        return ResponseEntity.ok(orderDetails); // Trả về List DTO (Đã đúng)
    }

    // --- SỬA HÀM NÀY ---
    @PutMapping("/{id}")
    public ResponseEntity<OrderDetailResponse> updateOrderDetail(@PathVariable Long id,
            @Valid @RequestBody UpdateOrderDetailRequest request) { // <-- Sửa kiểu ResponseEntity
        // Gọi service trả về DTO
        OrderDetailResponse updatedDto = orderDetailService.updateOrderDetail(id, request);
        // Trả về DTO với status 200 OK
        return ResponseEntity.ok(updatedDto);
    }
    // --- KẾT THÚC SỬA ---
}