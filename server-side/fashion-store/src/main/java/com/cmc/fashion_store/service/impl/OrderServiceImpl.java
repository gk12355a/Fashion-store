package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.OrderResponse; // Import DTO mới
import com.cmc.fashion_store.dto.CreateOrderRequest;
import com.cmc.fashion_store.dto.OrderDetailResponse;
import com.cmc.fashion_store.dto.UpdateOrderRequest; // Import DTO mới
import com.cmc.fashion_store.model.Customer;
import com.cmc.fashion_store.model.Order;
import com.cmc.fashion_store.model.OrderDetail;
import com.cmc.fashion_store.repository.CustomerRepository; // Import CustomerRepository
import com.cmc.fashion_store.repository.OrderRepository;
import com.cmc.fashion_store.service.OrderService;
import jakarta.persistence.EntityNotFoundException; // Import Exception
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Collections;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable

import java.math.BigDecimal;
import java.time.LocalDateTime; // Import LocalDateTime
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository; // Inject CustomerRepository

    @Override
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        Page<Order> orderPage = orderRepository.findAll(pageable);
        return orderPage.map(this::convertOrderToDto);
    }

    // --- HÀM HELPER CHUYỂN ĐỔI ---

    private OrderResponse convertOrderToDto(Order order) {
        OrderResponse orderDto = new OrderResponse();
        orderDto.setId(order.getId());
        orderDto.setOrderDate(order.getOrderDate());
        orderDto.setStatus(order.getStatus());
        orderDto.setTotalAmount(order.getTotalAmount());
        if (order.getCustomer() != null) {
            orderDto.setCustomerId(order.getCustomer().getId());
        }
        if (order.getOrderDetails() != null) {
            orderDto.setOrderDetails(
                order.getOrderDetails().stream()
                     .map(this::convertOrderDetailToDto)
                     .collect(Collectors.toList())
            );
        }
        return orderDto;
    }

    private OrderDetailResponse convertOrderDetailToDto(OrderDetail orderDetail) {
        OrderDetailResponse detailDto = new OrderDetailResponse();
        detailDto.setId(orderDetail.getId());
        detailDto.setQuantity(orderDetail.getQuantity());
        detailDto.setUnitPrice(orderDetail.getUnitPrice());
        if (orderDetail.getOrder() != null) {
            detailDto.setOrderId(orderDetail.getOrder().getId());
        }
        if (orderDetail.getProduct() != null) {
            detailDto.setProductId(orderDetail.getProduct().getId());
        }
        return detailDto;
    }

    @Override
    public Order createOrder(CreateOrderRequest request) {
        // 1. Kiểm tra xem khách hàng với customerId có tồn tại không.
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy khách hàng với ID: " + request.getCustomerId()));

        // 2. Chuyển đổi từ DTO sang Entity
        Order newOrder = new Order();
        newOrder.setCustomer(customer); 
        newOrder.setStatus(request.getStatus());
        
        // --- THAY ĐỔI Ở ĐÂY ---
        // Xóa dòng cũ: newOrder.setTotalAmount(request.getTotalAmount());
        // Thay bằng: Khởi tạo tổng tiền là 0.
        newOrder.setTotalAmount(BigDecimal.ZERO); 
        // -----------------------

        newOrder.setOrderDate(LocalDateTime.now()); 

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

    @Override
    public List<Order> searchOrders(Long customerId, String status) {
        if (customerId != null) {
            return orderRepository.findByCustomerId(customerId);
        }
        if (status != null && !status.isBlank()) {
            return orderRepository.findByStatusContainingIgnoreCase(status);
        }
        // Nếu không có tham số nào được cung cấp, trả về danh sách rỗng
        return Collections.emptyList();
    }

    @Override
    public Order updateOrder(Long id, UpdateOrderRequest request) {
        // 1. Tìm đơn hàng trong DB, nếu không thấy thì báo lỗi
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với ID: " + id));

        // 2. Cập nhật các trường cho phép
        existingOrder.setStatus(request.getStatus());

        // --- THAY ĐỔI Ở ĐÂY ---
        // Xóa dòng: existingOrder.setTotalAmount(request.getTotalAmount());
        // Lý do: Không cho phép cập nhật tổng tiền thủ công.
        // -----------------------

        // 3. Lưu lại vào DB
        return orderRepository.save(existingOrder);
    }

}