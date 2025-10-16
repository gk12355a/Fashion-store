package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.model.OrderDetail;
import com.cmc.fashion_store.repository.OrderDetailRepository;
import com.cmc.fashion_store.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Override
    public List<OrderDetail> getAllOrderDetails() {
        return orderDetailRepository.findAll();
    }
}