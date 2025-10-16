package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.CreateOrderDetailRequest; // Import DTO
import com.cmc.fashion_store.model.OrderDetail;
import com.cmc.fashion_store.service.OrderDetailService;
import jakarta.validation.Valid; // Import cho @Valid
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/order-details") // -> /api/v1/order-details
public class OrderDetailController {

    @Autowired
    private OrderDetailService orderDetailService;

    // API này sẽ xử lý yêu cầu GET đến /api/v1/order-details
    @GetMapping
    public ResponseEntity<List<OrderDetail>> getAllOrderDetails() {
        List<OrderDetail> orderDetails = orderDetailService.getAllOrderDetails();
        return ResponseEntity.ok(orderDetails);
    }
    // API này sẽ xử lý yêu cầu POST đến /api/v1/order-details
    @PostMapping
    public ResponseEntity<OrderDetail> createOrderDetail(@Valid @RequestBody CreateOrderDetailRequest request) {
        OrderDetail createdOrderDetail = orderDetailService.createOrderDetail(request);
        // Trả về chi tiết đơn hàng vừa tạo với status 201 CREATED
        return new ResponseEntity<>(createdOrderDetail, HttpStatus.CREATED);
    }
}