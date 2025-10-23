package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.OrderDetailResponse; // Import DTO
import com.cmc.fashion_store.dto.CreateOrderDetailRequest; // Import DTO
import com.cmc.fashion_store.dto.UpdateOrderDetailRequest; // Import DTO mới
import com.cmc.fashion_store.model.OrderDetail;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import java.util.List;

public interface OrderDetailService {
    /**
     * Lấy danh sách chi tiết đơn hàng có phân trang.
     * @param pageable đối tượng chứa thông tin phân trang.
     * @return một trang (Page) chứa danh sách OrderDetail.
     */
    Page<OrderDetailResponse> getAllOrderDetails(Pageable pageable);
    /**
     * Tạo một chi tiết đơn hàng mới.
     * @param request thông tin chi tiết đơn hàng mới.
     * @return OrderDetail đã được tạo.
     */
    OrderDetail createOrderDetail(CreateOrderDetailRequest request);
    /**
     * Xóa một chi tiết đơn hàng dựa vào ID.
     * @param id ID của chi tiết đơn hàng cần xóa.
     */
    void deleteOrderDetail(Long id);
    /**
     * Tìm kiếm chi tiết đơn hàng và trả về danh sách Entity.
     * @param orderId ID của đơn hàng (có thể null).
     * @param productId ID của sản phẩm (có thể null).
     * @return Danh sách chi tiết đơn hàng (Entity) phù hợp.
     */
    List<OrderDetailResponse> searchOrderDetails(Long orderId, Long productId);
    /**
     * Cập nhật thông tin một chi tiết đơn hàng.
     * @param id ID của chi tiết đơn hàng cần cập nhật.
     * @param request Đối tượng chứa thông tin mới.
     * @return OrderDetail đã được cập nhật.
     */
    OrderDetail updateOrderDetail(Long id, UpdateOrderDetailRequest request);
}