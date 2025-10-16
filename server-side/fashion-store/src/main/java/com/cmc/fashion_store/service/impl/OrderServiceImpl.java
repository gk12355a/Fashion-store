package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.model.Order;
import com.cmc.fashion_store.repository.OrderRepository;
import com.cmc.fashion_store.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}