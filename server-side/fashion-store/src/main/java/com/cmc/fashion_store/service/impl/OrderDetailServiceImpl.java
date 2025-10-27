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
    public OrderDetailResponse createOrderDetail(CreateOrderDetailRequest request) { // <-- Kiểu trả về ĐÚNG
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Đơn hàng với ID: " + request.getOrderId()));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Sản phẩm với ID: " + request.getProductId()));

        int requestedQuantity = request.getQuantity();
        int currentStock = product.getStockQuantity();

        if (currentStock < requestedQuantity) {
            throw new RuntimeException("Không đủ hàng cho sản phẩm '" + product.getName() + "'. Chỉ còn " + currentStock);
        }

        product.setStockQuantity(currentStock - requestedQuantity);
        // Không cần save product

        OrderDetail newOrderDetail = new OrderDetail();
        newOrderDetail.setOrder(order);
        newOrderDetail.setProduct(product);
        newOrderDetail.setQuantity(requestedQuantity);
        newOrderDetail.setUnitPrice(product.getPrice()); // Tự động lấy giá

        OrderDetail savedDetail = orderDetailRepository.save(newOrderDetail);
        updateOrderTotalAmount(savedDetail.getOrder().getId()); // Cập nhật tổng tiền

        return convertToDto(savedDetail); // <-- Sửa return: Trả về DTO
    }

    @Override
    @Transactional // Ghi đè chỉ đọc
    public OrderDetailResponse updateOrderDetail(Long id, UpdateOrderDetailRequest request) { // <-- Kiểu trả về ĐÚNG
        OrderDetail existingDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy chi tiết đơn hàng với ID: " + id));

        Product oldProduct = existingDetail.getProduct();
        int oldQuantity = existingDetail.getQuantity();
        Long orderId = existingDetail.getOrder().getId();

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
                productToSet.setStockQuantity(newStock);
            }
        } else {
            Product newProduct = productRepository.findById(newProductId)
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Sản phẩm mới với ID: " + newProductId));
            productToSet = newProduct;

            if (oldProduct != null) {
                oldProduct.setStockQuantity(oldProduct.getStockQuantity() + oldQuantity);
            }
            int currentNewStock = newProduct.getStockQuantity();
            if (currentNewStock < newQuantity) {
                throw new RuntimeException("Không đủ hàng cho sản phẩm '" + newProduct.getName() + "'. Chỉ còn " + currentNewStock);
            }
            newProduct.setStockQuantity(currentNewStock - newQuantity);
        }

        existingDetail.setProduct(productToSet);
        existingDetail.setQuantity(newQuantity);
        existingDetail.setUnitPrice(productToSet.getPrice());

        // Không cần save existingDetail rõ ràng nếu entity được quản lý
        updateOrderTotalAmount(orderId); // Cập nhật tổng tiền

        return convertToDto(existingDetail); // <-- Sửa return: Trả về DTO
    }


    @Override
    @Transactional // Ghi đè chỉ đọc
    public void deleteOrderDetail(Long id) {
        OrderDetail detailToDelete = orderDetailRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy chi tiết đơn hàng với ID: " + id));
        Long orderId = detailToDelete.getOrder().getId();

        Product product = detailToDelete.getProduct();
        if (product != null) {
            int deletedQuantity = detailToDelete.getQuantity();
            product.setStockQuantity(product.getStockQuantity() + deletedQuantity);
            // Không cần save product
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