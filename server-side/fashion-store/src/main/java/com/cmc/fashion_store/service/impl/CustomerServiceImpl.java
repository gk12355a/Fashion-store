package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.model.Customer;
import com.cmc.fashion_store.repository.CustomerRepository;
import com.cmc.fashion_store.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
}