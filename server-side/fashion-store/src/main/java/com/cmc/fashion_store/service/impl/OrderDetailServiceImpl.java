package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.OrderDetailResponse; // Import DTO
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
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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
    public Page<OrderDetailResponse> getAllOrderDetails(Pageable pageable) {
        // 1. Lấy Page<Entity> từ repository
        Page<OrderDetail> orderDetailPage = orderDetailRepository.findAll(pageable);

        // 2. Dùng .map() để chuyển đổi Page<Entity> thành Page<DTO>
        return orderDetailPage.map(this::convertToDto);
    }

    // Hàm helper để chuyển đổi một Entity sang một DTO
    private OrderDetailResponse convertToDto(OrderDetail orderDetail) {
        OrderDetailResponse dto = new OrderDetailResponse();
        dto.setId(orderDetail.getId());
        dto.setQuantity(orderDetail.getQuantity());
        dto.setUnitPrice(orderDetail.getUnitPrice());
        // Lấy ID từ các đối tượng liên quan (có kiểm tra null để an toàn)
        if (orderDetail.getOrder() != null) {
            dto.setOrderId(orderDetail.getOrder().getId());
        }
        if (orderDetail.getProduct() != null) {
            dto.setProductId(orderDetail.getProduct().getId());
        }
        return dto;
    }
    @Override
    @Transactional // Đảm bảo tất cả thao tác (save + update) cùng thành công
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
        OrderDetail savedDetail = orderDetailRepository.save(newOrderDetail);

        // 5. CẬP NHẬT TỔNG TIỀN (THÊM DÒNG NÀY)
        updateOrderTotalAmount(savedDetail.getOrder().getId());

        return savedDetail;
    }
    @Override
    @Transactional
    public OrderDetail updateOrderDetail(Long id, UpdateOrderDetailRequest request) {
        // 1. Tìm chi tiết đơn hàng trong DB
        OrderDetail existingDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy chi tiết đơn hàng với ID: " + id));

        // 2. Cập nhật thông tin
        existingDetail.setQuantity(request.getQuantity());
        existingDetail.setUnitPrice(request.getUnitPrice());

        // 3. Lưu lại vào DB
        OrderDetail updatedDetail = orderDetailRepository.save(existingDetail);

        // 4. CẬP NHẬT TỔNG TIỀN (THÊM DÒNG NÀY)
        updateOrderTotalAmount(updatedDetail.getOrder().getId());

        return updatedDetail;
    }
    @Override
    @Transactional // Đảm bảo cả 2 thao tác (xóa + cập nhật) cùng thành công
    public void deleteOrderDetail(Long id) {
        // 1. Tìm chi tiết đơn hàng TRƯỚC KHI XÓA
        OrderDetail detailToDelete = orderDetailRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy chi tiết đơn hàng với ID: " + id));

        // 2. Lấy OrderID của nó ra
        Long orderId = detailToDelete.getOrder().getId();

        // 3. Xóa chi tiết đơn hàng
        orderDetailRepository.delete(detailToDelete);

        // 4. Gọi hàm cập nhật tổng tiền cho Order cha
        updateOrderTotalAmount(orderId);
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
    // --- HÀM HELPER MỚI THÊM VÀO ---
    /**
     * Tính toán lại tổng tiền của một Đơn hàng dựa trên các Chi tiết đơn hàng của nó
     * và cập nhật lại vào DB.
     * @param orderId ID của Đơn hàng cần được cập nhật
     */
    private void updateOrderTotalAmount(Long orderId) {
        // 1. Tìm tất cả các chi tiết thuộc về đơn hàng này
        // (Bạn cần thêm hàm này vào OrderDetailRepository)
        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);

        // 2. Tính tổng tiền mới
        BigDecimal totalAmount = BigDecimal.ZERO; 
        for (OrderDetail detail : details) {
            BigDecimal lineTotal = detail.getUnitPrice().multiply(new BigDecimal(detail.getQuantity()));
            totalAmount = totalAmount.add(lineTotal);
        }

        // 3. Lấy đơn hàng cha
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Đơn hàng với ID: " + orderId));

        // 4. Cập nhật tổng tiền mới
        order.setTotalAmount(totalAmount);

        // 5. Lưu lại đơn hàng
        orderRepository.save(order);
    }
}