package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.model.Product;
import com.cmc.fashion_store.repository.ProductRepository;
import com.cmc.fashion_store.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}