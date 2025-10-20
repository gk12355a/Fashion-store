package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.CreateOrderDetailRequest; // Import DTO
import com.cmc.fashion_store.dto.UpdateOrderDetailRequest; // Import DTO mới
import com.cmc.fashion_store.dto.OrderDetailResponse; // Import DTO
import com.cmc.fashion_store.model.OrderDetail;
import com.cmc.fashion_store.service.OrderDetailService;
import jakarta.validation.Valid; // Import cho @Valid
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import org.springdoc.core.annotations.ParameterObject; // <-- THÊM IMPORT NÀY
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/order-details") // -> /api/v1/order-details
public class OrderDetailController {

    @Autowired
    private OrderDetailService orderDetailService;

    // API này sẽ xử lý yêu cầu GET đến /api/v1/order-details
    @GetMapping
    public ResponseEntity<Page<OrderDetailResponse>> getAllOrderDetails(@ParameterObject Pageable pageable) {
        Page<OrderDetailResponse> orderDetailsPage = orderDetailService.getAllOrderDetails(pageable);
        return ResponseEntity.ok(orderDetailsPage);
    }
    // API này sẽ xử lý yêu cầu POST đến /api/v1/order-details
    @PostMapping
    public ResponseEntity<OrderDetail> createOrderDetail(@Valid @RequestBody CreateOrderDetailRequest request) {
        OrderDetail createdOrderDetail = orderDetailService.createOrderDetail(request);
        // Trả về chi tiết đơn hàng vừa tạo với status 201 CREATED
        return new ResponseEntity<>(createdOrderDetail, HttpStatus.CREATED);
    }
    // API này sẽ xử lý yêu cầu DELETE đến /api/v1/order-details/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderDetail(@PathVariable Long id) {
        orderDetailService.deleteOrderDetail(id);
        // Trả về status 204 No Content, báo hiệu xóa thành công
        return ResponseEntity.noContent().build();
    }
    // API này sẽ xử lý yêu cầu GET đến /api/v1/order-details/search
    //http://localhost:8080/api/v1/order-details/search?orderId=2
    @GetMapping("/search")
    public ResponseEntity<List<OrderDetail>> searchOrderDetails(
            @RequestParam(required = false) Long orderId,
            @RequestParam(required = false) Long productId) {
        List<OrderDetail> orderDetails = orderDetailService.searchOrderDetails(orderId, productId);
        return ResponseEntity.ok(orderDetails);
    }
    // API này sẽ xử lý yêu cầu PUT đến /api/v1/order-details/{id}
    @PutMapping("/{id}")
    public ResponseEntity<OrderDetail> updateOrderDetail(@PathVariable Long id, @Valid @RequestBody UpdateOrderDetailRequest request) {
        OrderDetail updatedDetail = orderDetailService.updateOrderDetail(id, request);
        return ResponseEntity.ok(updatedDetail);
    }
}