package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.CreateCustomerRequest; // Import DTO
import com.cmc.fashion_store.dto.UpdateCustomerRequest; // Import DTO mới
import com.cmc.fashion_store.model.Customer;
import com.cmc.fashion_store.service.CustomerService;
import jakarta.validation.Valid; // Import cho @Valid
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import org.springdoc.core.annotations.ParameterObject; // <-- THÊM IMPORT NÀY

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/customers") // -> /api/v1/customers
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // API này sẽ xử lý yêu cầu GET đến /api/v1/customers
    @GetMapping
    public ResponseEntity<Page<Customer>> getAllCustomers(@ParameterObject Pageable pageable) {
        Page<Customer> customersPage = customerService.getAllCustomers(pageable);
        return ResponseEntity.ok(customersPage);
    }
    
    // API này sẽ xử lý yêu cầu POST đến /api/v1/customers
    @PostMapping
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody CreateCustomerRequest request) {
        Customer createdCustomer = customerService.createCustomer(request);
        // Trả về khách hàng vừa tạo với status 201 CREATED
        return new ResponseEntity<>(createdCustomer, HttpStatus.CREATED);
    }
    // API này sẽ xử lý yêu cầu DELETE đến /api/v1/customers/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        // Trả về status 204 No Content, báo hiệu xóa thành công
        return ResponseEntity.noContent().build();
    }
    // This API will handle GET requests to /api/v1/customers/search
    // Example: /api/v1/customers/search?q=nguyen
    @GetMapping("/search")
    public ResponseEntity<List<Customer>> searchCustomers(@RequestParam(name = "q") String query) {
        List<Customer> customers = customerService.searchCustomers(query);
        return ResponseEntity.ok(customers);
    }
    // API này sẽ xử lý yêu cầu PUT đến /api/v1/customers/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @Valid @RequestBody UpdateCustomerRequest request) {
        Customer updatedCustomer = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(updatedCustomer); // Trả về khách hàng đã cập nhật và status 200 OK
    }
    // --- THÊM ENDPOINT MỚI ---
    @GetMapping("/autocomplete")
    public ResponseEntity<List<String>> getAutocompleteSuggestions(@RequestParam("q") String query) {
        List<String> suggestions = customerService.getAutocompleteSuggestions(query);
        return ResponseEntity.ok(suggestions);
    }
}