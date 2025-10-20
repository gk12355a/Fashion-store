package com.cmc.fashion_store.service;

import org.springframework.web.multipart.MultipartFile;

public interface IStorageService {
    /**
     * Tải file lên dịch vụ lưu trữ (Cloudinary).
     * @param file File người dùng tải lên
     * @return Đường dẫn URL công khai của file
     */
    String storeFile(MultipartFile file);
}