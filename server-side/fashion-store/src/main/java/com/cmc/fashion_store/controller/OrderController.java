package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.model.Order;
import com.cmc.fashion_store.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/orders") // -> /api/v1/orders
public class OrderController {

    @Autowired
    private OrderService orderService;

    // API này sẽ xử lý yêu cầu GET đến /api/v1/orders
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders); // Trả về danh sách đơn hàng và status 200 OK
    }
}