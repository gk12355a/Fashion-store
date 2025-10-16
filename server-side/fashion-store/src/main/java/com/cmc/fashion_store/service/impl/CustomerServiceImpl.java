package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.CreateCustomerRequest; // Import DTO
import com.cmc.fashion_store.dto.UpdateCustomerRequest; // Import DTO mới
import com.cmc.fashion_store.model.Customer;
import com.cmc.fashion_store.repository.CustomerRepository;
import com.cmc.fashion_store.service.CustomerService;
import jakarta.persistence.EntityNotFoundException;
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
    @Override
    public void deleteCustomer(Long id) {
        // Kiểm tra xem khách hàng có tồn tại không trước khi xóa
        if (!customerRepository.existsById(id)) {
            // Nếu không tìm thấy, ném ra một exception để báo lỗi
            throw new EntityNotFoundException("Không tìm thấy khách hàng với ID: " + id);
        }
        customerRepository.deleteById(id);
    }
    @Override
    public List<Customer> searchCustomers(String query) {
        // Pass the same query to all parameters of the repository method
        return customerRepository.findByNameContainingIgnoreCaseOrPhoneNumberContainingIgnoreCaseOrEmailContainingIgnoreCase(
                query, query, query
        );
    }
    @Override
    public Customer updateCustomer(Long id, UpdateCustomerRequest request) {
        // 1. Tìm khách hàng trong DB, nếu không thấy thì báo lỗi
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng với ID: " + id));

        // 2. Cập nhật thông tin
        existingCustomer.setName(request.getName());
        existingCustomer.setPhoneNumber(request.getPhoneNumber());
        existingCustomer.setEmail(request.getEmail());
        existingCustomer.setMembershipType(request.getMembershipType());
        existingCustomer.setRewardPoints(request.getRewardPoints());

        // 3. Lưu lại vào DB
        return customerRepository.save(existingCustomer);
    }

}