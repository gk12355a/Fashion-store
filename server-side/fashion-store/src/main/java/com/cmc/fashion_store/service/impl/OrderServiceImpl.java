package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.OrderResponse; // Import DTO mới
import com.cmc.fashion_store.dto.CreateOrderRequest;
import com.cmc.fashion_store.dto.OrderDetailResponse;
import com.cmc.fashion_store.dto.UpdateOrderRequest; // Import DTO mới
import com.cmc.fashion_store.model.Customer;
import com.cmc.fashion_store.model.Order;
import com.cmc.fashion_store.model.OrderDetail;
import com.cmc.fashion_store.model.Promotion;
import com.cmc.fashion_store.repository.CustomerRepository; // Import CustomerRepository
import com.cmc.fashion_store.repository.OrderRepository;
import com.cmc.fashion_store.repository.PromotionRepository;
import com.cmc.fashion_store.service.OrderService;
import jakarta.persistence.EntityNotFoundException; // Import Exception
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Collections;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime; // Import LocalDateTime
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository; // Inject CustomerRepository

    @Autowired
    private PromotionRepository promotionRepository;

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
                            .collect(Collectors.toList()));
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
        // 1. Tìm khách hàng
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng: " + request.getCustomerId()));

        Order newOrder = new Order();
        newOrder.setCustomer(customer);
        newOrder.setStatus("Đang chờ xử lý");
        newOrder.setTotalAmount(BigDecimal.ZERO);
        newOrder.setOrderDate(LocalDateTime.now());

        // --- LOGIC MỚI: GÁN KHUYẾN MÃI ---
        if (request.getPromotionId() != null) {
            Promotion promotion = promotionRepository.findById(request.getPromotionId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khuyến mãi: " + request.getPromotionId()));
            
            // Kiểm tra xem khuyến mãi còn hạn không
            if (promotion.getExpiryDate() != null && promotion.getExpiryDate().isBefore(LocalDate.now())) {
                 throw new IllegalArgumentException("Khuyến mãi này đã hết hạn.");
            }
            
            newOrder.setPromotion(promotion);
        }
        // ---------------------------------

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
    public List<OrderResponse> searchOrders(Long customerId, String status) {
        List<Order> foundOrders; // Danh sách Entity kết quả

        // 1. Thực hiện tìm kiếm Entity như cũ
        if (customerId != null) {
            foundOrders = orderRepository.findByCustomerId(customerId);
        } else if (status != null && !status.isBlank()) {
            // Giả sử bạn có hàm findByStatus... trong Repository
            foundOrders = orderRepository.findByStatusContainingIgnoreCase(status);
        } else {
            foundOrders = Collections.emptyList();
        }

        // 2. Chuyển đổi List<Order> sang List<OrderResponse>
        return foundOrders.stream()
                .map(this::convertOrderToDto) // Sử dụng lại hàm helper
                .collect(Collectors.toList());
    }

    @Override
    public Order updateOrder(Long id, UpdateOrderRequest request) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với ID: " + id));

        // --- THAY ĐỔI LOGIC Ở ĐÂY ---
        // Không cho phép API này cập nhật status,
        // vì status sẽ được cập nhật tự động bởi Payment
        // Dòng cũ bị xóa: existingOrder.setStatus(request.getStatus());
        // -------------------------

        // (Bạn có thể thêm logic cập nhật các trường khác ở đây nếu muốn, ví dụ: địa
        // chỉ giao hàng)

        return orderRepository.save(existingOrder);
    }

}