package com.cmc.fashion_store.service;

import com.cmc.fashion_store.model.Customer;
import java.util.List;

public interface CustomerService {
    /**
     * Lấy danh sách tất cả khách hàng.
     * @return danh sách Customer.
     */
    List<Customer> getAllCustomers();
}