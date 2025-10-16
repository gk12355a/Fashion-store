package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.CreateCustomerRequest; // Import DTO
import com.cmc.fashion_store.dto.UpdateCustomerRequest; // Import DTO mới
import com.cmc.fashion_store.model.Customer;
import java.util.List;

public interface CustomerService {
    /**
     * Lấy danh sách tất cả khách hàng.
     * @return danh sách Customer.
     */
    List<Customer> getAllCustomers();
    /**
     * Tạo một khách hàng mới.
     * @param request thông tin khách hàng mới.
     * @return Customer đã được tạo.
     */
    Customer createCustomer(CreateCustomerRequest request);
    /**
     * Xóa một khách hàng dựa vào ID.
     * @param id ID của khách hàng cần xóa.
     */
    void deleteCustomer(Long id);
    /**
     * Searches for customers based on a query.
     * @param query The search keyword.
     * @return A list of matching customers.
     */
    List<Customer> searchCustomers(String query);
    /**
     * Cập nhật thông tin một khách hàng.
     * @param id ID của khách hàng cần cập nhật.
     * @param request Đối tượng chứa thông tin mới.
     * @return Customer đã được cập nhật.
     */
    Customer updateCustomer(Long id, UpdateCustomerRequest request);

}