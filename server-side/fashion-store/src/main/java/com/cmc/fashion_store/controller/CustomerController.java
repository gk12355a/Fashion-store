package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.model.Customer;
import com.cmc.fashion_store.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}