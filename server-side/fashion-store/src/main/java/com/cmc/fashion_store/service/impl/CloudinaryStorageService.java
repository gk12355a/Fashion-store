package com.cmc.fashion_store.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.cmc.fashion_store.service.IStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryStorageService implements IStorageService {

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public String storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file.");
        }

        try {
            // Tải file lên Cloudinary
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", UUID.randomUUID().toString(),
                            "resource_type", "auto"
                    )
            );

            // Lấy URL an toàn (https) của ảnh đã upload
            return (String) uploadResult.get("secure_url");

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }
}