package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.CreateOrderRequest;
import com.cmc.fashion_store.model.Customer;
import com.cmc.fashion_store.model.Order;
import com.cmc.fashion_store.repository.CustomerRepository; // Import CustomerRepository
import com.cmc.fashion_store.repository.OrderRepository;
import com.cmc.fashion_store.service.OrderService;
import jakarta.persistence.EntityNotFoundException; // Import Exception
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime; // Import LocalDateTime
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository; // Inject CustomerRepository

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order createOrder(CreateOrderRequest request) {
        // 1. Kiểm tra xem khách hàng với customerId có tồn tại không.
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng với ID: " + request.getCustomerId()));

        // 2. Chuyển đổi từ DTO sang Entity
        Order newOrder = new Order();
        newOrder.setCustomer(customer); // Gán khách hàng đã tìm thấy
        newOrder.setStatus(request.getStatus());
        newOrder.setTotalAmount(request.getTotalAmount());
        newOrder.setOrderDate(LocalDateTime.now()); // Tự động lấy ngày giờ hiện tại

        // 3. Lưu vào database
        return orderRepository.save(newOrder);
    }
    @Override
    public void deleteOrder(Long id) {
        // Kiểm tra xem đơn hàng có tồn tại không trước khi xóa
        if (!orderRepository.existsById(id)) {
            // Nếu không tìm thấy, ném ra một exception để báo lỗi
            throw new EntityNotFoundException("Không tìm thấy đơn hàng với ID: " + id);
        }
        orderRepository.deleteById(id);
    }


}