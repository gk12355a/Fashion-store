package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.model.OrderDetail;
import com.cmc.fashion_store.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}