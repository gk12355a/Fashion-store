package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.CreateCustomerRequest; // Import DTO
import com.cmc.fashion_store.model.Customer;
import com.cmc.fashion_store.service.CustomerService;
import jakarta.validation.Valid; // Import cho @Valid
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("${api.prefix}/customers") // -> /api/v1/customers
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // API này sẽ xử lý yêu cầu GET đến /api/v1/customers
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers); // Trả về danh sách khách hàng và status 200 OK
    }
    // API này sẽ xử lý yêu cầu POST đến /api/v1/customers
    @PostMapping
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody CreateCustomerRequest request) {
        Customer createdCustomer = customerService.createCustomer(request);
        // Trả về khách hàng vừa tạo với status 201 CREATED
        return new ResponseEntity<>(createdCustomer, HttpStatus.CREATED);
    }
}