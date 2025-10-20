package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.OrderDetailResponse; // Import DTO
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import com.cmc.fashion_store.dto.CreateOrderDetailRequest;
import com.cmc.fashion_store.dto.UpdateOrderDetailRequest; // Import DTO mới    
import com.cmc.fashion_store.model.Order;
import com.cmc.fashion_store.model.OrderDetail;
import com.cmc.fashion_store.model.Product;
import com.cmc.fashion_store.model.Promotion;
import com.cmc.fashion_store.repository.OrderDetailRepository;
import com.cmc.fashion_store.repository.OrderRepository;
import com.cmc.fashion_store.repository.ProductRepository;
import com.cmc.fashion_store.service.OrderDetailService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
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
    @Transactional
    public OrderDetail createOrderDetail(CreateOrderDetailRequest request) {
        // 1. Kiểm tra Mã đơn hợp lệ
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Không tìm thấy Đơn hàng với ID: " + request.getOrderId()));

        // 2. Kiểm tra Mã sản phẩm VÀ LẤY SẢN PHẨM
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Không tìm thấy Sản phẩm với ID: " + request.getProductId()));

        // --- LOGIC MỚI: KIỂM TRA VÀ TRỪ KHO ---
        int requestedQuantity = request.getQuantity();
        int currentStock = product.getStockQuantity();

        if (currentStock < requestedQuantity) {
            // Nếu không đủ hàng, ném ra lỗi
            throw new RuntimeException("Không đủ hàng. Chỉ còn " + currentStock + " sản phẩm.");
        }

        // Trừ kho
        product.setStockQuantity(currentStock - requestedQuantity);
        productRepository.save(product); // Lưu lại số lượng tồn kho mới
        // ----------------------------------------

        // 3. Chuyển đổi từ DTO sang Entity
        OrderDetail newOrderDetail = new OrderDetail();
        newOrderDetail.setOrder(order);
        newOrderDetail.setProduct(product);
        newOrderDetail.setQuantity(requestedQuantity); // Dùng biến đã kiểm tra
        newOrderDetail.setUnitPrice(product.getPrice()); // Tự động lấy giá (đã sửa)

        // 4. Lưu chi tiết
        OrderDetail savedDetail = orderDetailRepository.save(newOrderDetail);

        // 5. Cập nhật tổng tiền Order (đã sửa)
        updateOrderTotalAmount(savedDetail.getOrder().getId());

        return savedDetail;
    }

    @Override
    @Transactional
    public OrderDetail updateOrderDetail(Long id, UpdateOrderDetailRequest request) {
        // 1. Tìm chi tiết đơn hàng
        OrderDetail existingDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy chi tiết đơn hàng với ID: " + id));

        int oldQuantity = existingDetail.getQuantity();
        int newQuantity = request.getQuantity();

        // Nếu số lượng không đổi thì không làm gì
        if (oldQuantity != newQuantity) {
            Product product = existingDetail.getProduct();
            int currentStock = product.getStockQuantity();

            // Tính toán số lượng chênh lệch
            int quantityDifference = newQuantity - oldQuantity; // > 0 là mua thêm, < 0 là trả bớt

            int newStock = currentStock - quantityDifference;

            // --- LOGIC MỚI: KIỂM TRA VÀ CẬP NHẬT KHO ---
            if (newStock < 0) {
                throw new RuntimeException("Không đủ hàng. Chỉ còn " + currentStock + " sản phẩm.");
            }

            product.setStockQuantity(newStock);
            productRepository.save(product);
            // ------------------------------------------

            // 2. Cập nhật số lượng mới
            existingDetail.setQuantity(newQuantity);
        }

        // 3. Lưu lại chi tiết vào DB
        OrderDetail updatedDetail = orderDetailRepository.save(existingDetail);

        // 4. Cập nhật tổng tiền Order
        updateOrderTotalAmount(updatedDetail.getOrder().getId());

        return updatedDetail;
    }

    @Override
    @Transactional
    public void deleteOrderDetail(Long id) {
        // 1. Tìm chi tiết trước khi xóa
        OrderDetail detailToDelete = orderDetailRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy chi tiết đơn hàng với ID: " + id));

        // 2. Lấy OrderID ra
        Long orderId = detailToDelete.getOrder().getId();

        // --- LOGIC MỚI: HOÀN TRẢ KHO ---
        Product product = detailToDelete.getProduct();
        int deletedQuantity = detailToDelete.getQuantity();
        product.setStockQuantity(product.getStockQuantity() + deletedQuantity);
        productRepository.save(product);
        // ---------------------------------

        // 3. Xóa chi tiết
        orderDetailRepository.delete(detailToDelete);

        // 4. Cập nhật tổng tiền Order
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
     * Tính toán lại tổng tiền của một Đơn hàng dựa trên các Chi tiết đơn hàng của
     * nó
     * và cập nhật lại vào DB.
     * 
     * @param orderId ID của Đơn hàng cần được cập nhật
     */
    private void updateOrderTotalAmount(Long orderId) {
        // 1. Lấy đơn hàng
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Đơn hàng: " + orderId));

        // 2. Tính tổng tiền GỐC (Subtotal)
        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);
        BigDecimal subtotal = BigDecimal.ZERO; 
        for (OrderDetail detail : details) {
            BigDecimal lineTotal = detail.getUnitPrice().multiply(new BigDecimal(detail.getQuantity()));
            subtotal = subtotal.add(lineTotal);
        }
        
        BigDecimal finalTotalAmount = subtotal; // Mặc định tổng cuối = tổng gốc

        // 3. LẤY KHUYẾN MÃI TỪ ĐƠN HÀNG
        Promotion promotion = order.getPromotion();

        // 4. NẾU CÓ KHUYẾN MÃI, TÍNH TOÁN LẠI
        if (promotion != null) {
            // Kiểm tra lại hạn sử dụng (phòng trường hợp đơn hàng để lâu)
            if (promotion.getExpiryDate() == null || promotion.getExpiryDate().isAfter(LocalDate.now())) {
                
                // TODO: Logic này cần mở rộng dựa trên 'promotion.getType()'
                // Giả sử 'discountValue' là % (ví dụ: 15.00 cho 15%)
                if ("PERCENTAGE".equals(promotion.getType())) {
                    BigDecimal discountPercent = promotion.getDiscountValue().divide(new BigDecimal(100));
                    BigDecimal discountAmount = subtotal.multiply(discountPercent);
                    finalTotalAmount = subtotal.subtract(discountAmount);
                } 
                // Giả sử 'discountValue' là số tiền cố định (ví dụ: 50000)
                else if ("FIXED_AMOUNT".equals(promotion.getType())) {
                    finalTotalAmount = subtotal.subtract(promotion.getDiscountValue());
                }
                
                // Đảm bảo tổng tiền không bao giờ âm
                if (finalTotalAmount.compareTo(BigDecimal.ZERO) < 0) {
                    finalTotalAmount = BigDecimal.ZERO;
                }
            }
        }

        // 5. Cập nhật tổng tiền CUỐI CÙNG (đã giảm giá)
        order.setTotalAmount(finalTotalAmount);

        // 6. Lưu lại đơn hàng
        orderRepository.save(order);
    }
}