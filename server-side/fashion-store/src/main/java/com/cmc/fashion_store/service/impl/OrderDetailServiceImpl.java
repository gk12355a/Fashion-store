package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.OrderDetailResponse; // Import DTO
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import com.cmc.fashion_store.dto.CreateOrderDetailRequest;
import com.cmc.fashion_store.dto.UpdateOrderDetailRequest;
import com.cmc.fashion_store.model.Order;
import com.cmc.fashion_store.model.OrderDetail;
import com.cmc.fashion_store.model.Product;
import com.cmc.fashion_store.model.Promotion;
import com.cmc.fashion_store.repository.OrderDetailRepository;
import com.cmc.fashion_store.repository.OrderRepository;
import com.cmc.fashion_store.repository.ProductRepository;
import com.cmc.fashion_store.service.OrderDetailService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Sử dụng annotation này
import java.util.Arrays; // <-- Thêm import này
import java.math.BigDecimal;
import java.math.RoundingMode; // Import RoundingMode
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true) // Mặc định là chỉ đọc
public class OrderDetailServiceImpl implements OrderDetailService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    private static final List<String> LOCKED_ORDER_STATUSES = Arrays.asList("Đã thanh toán");

    @Override
    public Page<OrderDetailResponse> getAllOrderDetails(Pageable pageable) {
        Page<OrderDetail> orderDetailPage = orderDetailRepository.findAll(pageable);
        return orderDetailPage.map(this::convertToDto);
    }

    // Hàm helper chuyển Entity sang DTO (Đã có productName)
    private OrderDetailResponse convertToDto(OrderDetail orderDetail) {
        OrderDetailResponse dto = new OrderDetailResponse();
        dto.setId(orderDetail.getId());
        dto.setQuantity(orderDetail.getQuantity());
        dto.setUnitPrice(orderDetail.getUnitPrice());
        if (orderDetail.getOrder() != null) {
            dto.setOrderId(orderDetail.getOrder().getId());
        }
        if (orderDetail.getProduct() != null) {
            dto.setProductId(orderDetail.getProduct().getId());
            dto.setProductName(orderDetail.getProduct().getName()); // Đã thêm
        }
        return dto;
    }

    @Override
    @Transactional // Ghi đè chỉ đọc
    public OrderDetailResponse createOrderDetail(CreateOrderDetailRequest request) { // <-- Sửa kiểu trả về
        // 1. Lấy Order và KIỂM TRA TRẠNG THÁI
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Đơn hàng với ID: " + request.getOrderId()));

        // *** THÊM KIỂM TRA ***
        if (LOCKED_ORDER_STATUSES.contains(order.getStatus())) {
            throw new IllegalStateException("Không thể thêm chi tiết vào đơn hàng đã '" + order.getStatus() + "'.");
        }
        // *********************

        // 2. Tìm Product và xử lý kho (logic cũ)
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Sản phẩm với ID: " + request.getProductId()));
        // ... (kiểm tra kho, trừ kho) ...
         int requestedQuantity = request.getQuantity();
        int currentStock = product.getStockQuantity();
        if (currentStock < requestedQuantity) {
             throw new RuntimeException("Không đủ hàng cho sản phẩm '" + product.getName() + "'. Chỉ còn " + currentStock);
        }
        product.setStockQuantity(currentStock - requestedQuantity);


        // 3. Tạo và lưu OrderDetail (logic cũ)
        OrderDetail newOrderDetail = new OrderDetail();
        newOrderDetail.setOrder(order);
        newOrderDetail.setProduct(product);
        newOrderDetail.setQuantity(requestedQuantity);
        newOrderDetail.setUnitPrice(product.getPrice());

        OrderDetail savedDetail = orderDetailRepository.save(newOrderDetail);
        updateOrderTotalAmount(savedDetail.getOrder().getId()); // Cập nhật tổng tiền

        return convertToDto(savedDetail); // Trả về DTO
    }

    @Override
    @Transactional
    public OrderDetailResponse updateOrderDetail(Long id, UpdateOrderDetailRequest request) {
        OrderDetail existingDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy chi tiết đơn hàng với ID: " + id));
        Order order = existingDetail.getOrder();

        if (order == null) {
             throw new IllegalStateException("Chi tiết đơn hàng không liên kết với đơn hàng nào.");
        }
        // Sử dụng biến đã khai báo
        if (LOCKED_ORDER_STATUSES.contains(order.getStatus())) {
            throw new IllegalStateException("Không thể sửa chi tiết của đơn hàng đã '" + order.getStatus() + "'.");
        }

        Product oldProduct = existingDetail.getProduct();
        int oldQuantity = existingDetail.getQuantity();
        Long orderId = order.getId();
        Long newProductId = request.getProductId();
        int newQuantity = request.getQuantity();
        Product productToSet;
        boolean productChanged = oldProduct == null || !oldProduct.getId().equals(newProductId);

        if (!productChanged) {
            productToSet = oldProduct;
            if (oldQuantity != newQuantity) {
                int quantityDifference = newQuantity - oldQuantity;
                int currentStock = productToSet.getStockQuantity();
                int newStock = currentStock - quantityDifference;
                if (newStock < 0) {
                    throw new RuntimeException("Không đủ hàng cho sản phẩm '" + productToSet.getName() + "'. Chỉ còn " + currentStock);
                }
                // --- ⭐ SỬA LỖI Ở ĐÂY: Truyền newStock vào ⭐ ---
                productToSet.setStockQuantity(newStock);
                // ---------------------------------------------
            }
         } else {
             Product newProduct = productRepository.findById(newProductId)
                 .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Sản phẩm mới với ID: " + newProductId));
             productToSet = newProduct;
             if (oldProduct != null) {
                 // --- ⭐ SỬA LỖI Ở ĐÂY: Truyền giá trị hoàn kho ⭐ ---
                 oldProduct.setStockQuantity(oldProduct.getStockQuantity() + oldQuantity);
                 // -------------------------------------------------
             }
             int currentNewStock = newProduct.getStockQuantity();
             if (currentNewStock < newQuantity) {
                 throw new RuntimeException("Không đủ hàng cho sản phẩm '" + newProduct.getName() + "'. Chỉ còn " + currentNewStock);
             }
             // --- ⭐ SỬA LỖI Ở ĐÂY: Truyền giá trị kho mới ⭐ ---
             newProduct.setStockQuantity(currentNewStock - newQuantity);
             // ----------------------------------------------
         }

        existingDetail.setProduct(productToSet);
        existingDetail.setQuantity(newQuantity);
        existingDetail.setUnitPrice(productToSet.getPrice());

        updateOrderTotalAmount(orderId);

        return convertToDto(existingDetail);
    }


    @Override
    @Transactional
    public void deleteOrderDetail(Long id) {
        OrderDetail detailToDelete = orderDetailRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy chi tiết đơn hàng với ID: " + id));
        Order order = detailToDelete.getOrder();

        if (order == null) {
             throw new IllegalStateException("Chi tiết đơn hàng không liên kết với đơn hàng nào.");
        }
        // Sử dụng biến đã khai báo
        if (LOCKED_ORDER_STATUSES.contains(order.getStatus())) {
            throw new IllegalStateException("Không thể xóa chi tiết của đơn hàng đã '" + order.getStatus() + "'.");
        }

        Long orderId = order.getId();
        Product product = detailToDelete.getProduct();
        if (product != null) {
            int deletedQuantity = detailToDelete.getQuantity();
            // --- ⭐ SỬA LỖI Ở ĐÂY: Truyền giá trị hoàn kho ⭐ ---
            product.setStockQuantity(product.getStockQuantity() + deletedQuantity);
            // -------------------------------------------------
        }

        orderDetailRepository.delete(detailToDelete);
        updateOrderTotalAmount(orderId);
    }

    @Override
    public List<OrderDetailResponse> searchOrderDetails(Long orderId, Long productId) {
        List<OrderDetail> foundDetails;
        if (orderId != null) {
            foundDetails = orderDetailRepository.findByOrderId(orderId);
        } else if (productId != null) {
            foundDetails = orderDetailRepository.findByProductId(productId);
        } else {
            foundDetails = Collections.emptyList();
        }
        return foundDetails.stream()
                .map(this::convertToDto) // Chuyển sang DTO
                .collect(Collectors.toList());
    }

    // Hàm cập nhật tổng tiền đơn hàng (giữ nguyên)
    private void updateOrderTotalAmount(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Đơn hàng: " + orderId));
        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);
        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderDetail detail : details) {
            if (detail.getUnitPrice() != null && detail.getQuantity() > 0) {
                 subtotal = subtotal.add(detail.getUnitPrice().multiply(BigDecimal.valueOf(detail.getQuantity())));
            }
        }
        BigDecimal finalTotalAmount = subtotal;
        Promotion promotion = order.getPromotion();
        if (promotion != null && (promotion.getExpiryDate() == null || !promotion.getExpiryDate().isBefore(LocalDate.now()))) {
             if ("PERCENTAGE".equals(promotion.getType()) && promotion.getDiscountValue() != null) {
                 BigDecimal discountPercent = promotion.getDiscountValue().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
                 BigDecimal discountAmount = subtotal.multiply(discountPercent);
                 finalTotalAmount = subtotal.subtract(discountAmount);
             } else if ("FIXED_AMOUNT".equals(promotion.getType()) && promotion.getDiscountValue() != null) {
                 finalTotalAmount = subtotal.subtract(promotion.getDiscountValue());
             }
             if (finalTotalAmount.compareTo(BigDecimal.ZERO) < 0) {
                 finalTotalAmount = BigDecimal.ZERO;
             }
        }
        order.setTotalAmount(finalTotalAmount);
        orderRepository.save(order);
    }
}