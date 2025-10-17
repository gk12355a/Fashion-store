package com.example.demo.config;

import com.example.demo.entity.Promotion;
import com.example.demo.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private PromotionRepository promotionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (promotionRepository.count() == 0) {

            Promotion promotion1 = new Promotion();
            promotion1.setName("Khuyến mãi mùa hè");
            promotion1.setDiscountValue(20.0);
            promotion1.setExpiryDate(LocalDateTime.now().plusDays(30));
            promotion1.setType("PERCENTAGE");

            Promotion promotion2 = new Promotion();
            promotion2.setName("Giảm giá đầu năm");
            promotion2.setDiscountValue(50000.0);
            promotion2.setExpiryDate(LocalDateTime.now().plusDays(60));
            promotion2.setType("FIXED_AMOUNT");

            Promotion promotion3 = new Promotion();
            promotion3.setName("Khuyến mãi đặc biệt");
            promotion3.setDiscountValue(15.0);
            promotion3.setExpiryDate(LocalDateTime.now().plusDays(7));
            promotion3.setType("PERCENTAGE");

            promotionRepository.save(promotion1);
            promotionRepository.save(promotion2);
            promotionRepository.save(promotion3);

            System.out.println("✅ Đã tạo dữ liệu mẫu thành công!");
        }
    }
}