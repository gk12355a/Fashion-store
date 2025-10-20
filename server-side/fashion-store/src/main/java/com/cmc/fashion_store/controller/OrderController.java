package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.CreateOrderRequest; // Import DTO
import com.cmc.fashion_store.dto.UpdateOrderRequest; // Import DTO mới
import com.cmc.fashion_store.dto.OrderResponse; // Import DTO
import com.cmc.fashion_store.model.Order;
import com.cmc.fashion_store.service.OrderService;
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
@RequestMapping("${api.prefix}/orders") // -> /api/v1/orders
public class OrderController {

    @Autowired
    private OrderService orderService;

    // API này giờ sẽ trả về Page<DTO>
    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getAllOrders(@ParameterObject Pageable pageable) {
        Page<OrderResponse> ordersPage = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(ordersPage);
    }
    // API này sẽ xử lý yêu cầu POST đến /api/v1/orders
    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        Order createdOrder = orderService.createOrder(request);
        // Trả về đơn hàng vừa tạo với status 201 CREATED
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }
    // API này sẽ xử lý yêu cầu DELETE đến /api/v1/orders/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        // Trả về status 204 No Content, báo hiệu xóa thành công
        return ResponseEntity.noContent().build();
    }
    // API này sẽ xử lý yêu cầu GET đến /api/v1/orders/search
    @GetMapping("/search")
    public ResponseEntity<List<Order>> searchOrders(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) String status) {
        List<Order> orders = orderService.searchOrders(customerId, status);
        return ResponseEntity.ok(orders);
    }
    // API này sẽ xử lý yêu cầu PUT đến /api/v1/orders/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @Valid @RequestBody UpdateOrderRequest request) {
        Order updatedOrder = orderService.updateOrder(id, request);
        return ResponseEntity.ok(updatedOrder); // Trả về đơn hàng đã cập nhật và status 200 OK
    }
}