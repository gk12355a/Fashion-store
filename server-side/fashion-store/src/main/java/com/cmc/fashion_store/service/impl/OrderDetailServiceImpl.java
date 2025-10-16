package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.CreateOrderDetailRequest;
import com.cmc.fashion_store.model.Order;
import com.cmc.fashion_store.model.OrderDetail;
import com.cmc.fashion_store.model.Product;
import com.cmc.fashion_store.repository.OrderDetailRepository;
import com.cmc.fashion_store.repository.OrderRepository;
import com.cmc.fashion_store.repository.ProductRepository;
import com.cmc.fashion_store.service.OrderDetailService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderRepository orderRepository; // Inject OrderRepository

    @Autowired
    private ProductRepository productRepository; // Inject ProductRepository
  
    @Override
    public List<OrderDetail> getAllOrderDetails() {
        return orderDetailRepository.findAll();
    }
    @Override
    public OrderDetail createOrderDetail(CreateOrderDetailRequest request) {
        // 1. Kiểm tra Mã đơn hợp lệ
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Đơn hàng với ID: " + request.getOrderId()));

        // 2. Kiểm tra Mã sản phẩm hợp lệ
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Sản phẩm với ID: " + request.getProductId()));

        // 3. Chuyển đổi từ DTO sang Entity
        OrderDetail newOrderDetail = new OrderDetail();
        newOrderDetail.setOrder(order);
        newOrderDetail.setProduct(product);
        newOrderDetail.setQuantity(request.getQuantity());
        newOrderDetail.setUnitPrice(request.getUnitPrice());

        // 4. Lưu vào database
        return orderDetailRepository.save(newOrderDetail);
    }
}