package com.cmc.fashion_store.service.impl;

import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import com.cmc.fashion_store.dto.CreateOrderDetailRequest;
import com.cmc.fashion_store.dto.UpdateOrderDetailRequest; // Import DTO mới    
import com.cmc.fashion_store.model.Order;
import com.cmc.fashion_store.model.OrderDetail;
import com.cmc.fashion_store.model.Product;
import com.cmc.fashion_store.repository.OrderDetailRepository;
import com.cmc.fashion_store.repository.OrderRepository;
import com.cmc.fashion_store.repository.ProductRepository;
import com.cmc.fashion_store.service.OrderDetailService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderRepository orderRepository; // Inject OrderRepository

    @Autowired
    private ProductRepository productRepository; // Inject ProductRepository
  
    @Override
    public Page<OrderDetail> getAllOrderDetails(Pageable pageable) {
        return orderDetailRepository.findAll(pageable);
    }
    @Override
    public OrderDetail createOrderDetail(CreateOrderDetailRequest request) {
        // 1. Kiểm tra Mã đơn hợp lệ
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Đơn hàng với ID: " + request.getOrderId()));

        // 2. Kiểm tra Mã sản phẩm hợp lệ
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Sản phẩm với ID: " + request.getProductId()));

        // 3. Chuyển đổi từ DTO sang Entity
        OrderDetail newOrderDetail = new OrderDetail();
        newOrderDetail.setOrder(order);
        newOrderDetail.setProduct(product);
        newOrderDetail.setQuantity(request.getQuantity());
        newOrderDetail.setUnitPrice(request.getUnitPrice());

        // 4. Lưu vào database
        return orderDetailRepository.save(newOrderDetail);
    }
    @Override
    public void deleteOrderDetail(Long id) {
        // Kiểm tra xem chi tiết đơn hàng có tồn tại không trước khi xóa
        if (!orderDetailRepository.existsById(id)) {
            // Nếu không tìm thấy, ném ra một exception để báo lỗi
            throw new EntityNotFoundException("Không tìm thấy chi tiết đơn hàng với ID: " + id);
        }
        orderDetailRepository.deleteById(id);
    }
    @Override
    public List<OrderDetail> searchOrderDetails(Long orderId, Long productId) {
        if (orderId != null) {
            return orderDetailRepository.findByOrderId(orderId);
        }
        if (productId != null) {
            return orderDetailRepository.findByProductId(productId);
        }
        // Nếu không có tham số nào được cung cấp, trả về danh sách rỗng
        return Collections.emptyList();
    }
    @Override
    public OrderDetail updateOrderDetail(Long id, UpdateOrderDetailRequest request) {
        // 1. Tìm chi tiết đơn hàng trong DB, nếu không thấy thì báo lỗi
        OrderDetail existingDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy chi tiết đơn hàng với ID: " + id));

        // 2. Cập nhật thông tin
        existingDetail.setQuantity(request.getQuantity());
        existingDetail.setUnitPrice(request.getUnitPrice());

        // 3. Lưu lại vào DB
        return orderDetailRepository.save(existingDetail);
    }
}