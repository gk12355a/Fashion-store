package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.CreateCustomerRequest; // Import DTO
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
    @Override
    public Customer createCustomer(CreateCustomerRequest request) {
        // Chuyển đổi từ DTO sang Entity
        Customer newCustomer = new Customer();
        newCustomer.setName(request.getName());
        newCustomer.setPhoneNumber(request.getPhoneNumber());
        newCustomer.setEmail(request.getEmail());
        newCustomer.setMembershipType(request.getMembershipType());
        newCustomer.setRewardPoints(request.getRewardPoints());

        // Lưu vào database
        return customerRepository.save(newCustomer);
    }

}