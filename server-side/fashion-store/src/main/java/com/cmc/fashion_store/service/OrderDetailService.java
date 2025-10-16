package com.cmc.fashion_store.service;

import com.cmc.fashion_store.model.OrderDetail;
import java.util.List;

public interface OrderDetailService {
    /**
     * Lấy danh sách tất cả chi tiết đơn hàng.
     * @return danh sách OrderDetail.
     */
    List<OrderDetail> getAllOrderDetails();
}