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
            promotion1.setCode("SUMMER2024");
            promotion1.setDescription("Khuyến mãi đặc biệt cho mùa hè 2024");
            promotion1.setDiscountValue(20.0);
            promotion1.setDiscountType("PERCENTAGE");
            promotion1.setStartDate(LocalDateTime.now().plusDays(1));
            promotion1.setEndDate(LocalDateTime.now().plusDays(30));
            promotion1.setUsageLimit(1000);
            promotion1.setIsActive(true);

            Promotion promotion2 = new Promotion();
            promotion2.setName("Giảm giá đầu năm");
            promotion2.setCode("NEWYEAR2024");
            promotion2.setDescription("Chào đón năm mới 2024");
            promotion2.setDiscountValue(50000.0);
            promotion2.setDiscountType("FIXED_AMOUNT");
            promotion2.setStartDate(LocalDateTime.now().plusDays(5));
            promotion2.setEndDate(LocalDateTime.now().plusDays(60));
            promotion2.setUsageLimit(500);
            promotion2.setIsActive(true);

            promotionRepository.save(promotion1);
            promotionRepository.save(promotion2);

            System.out.println("✅ Đã tạo dữ liệu mẫu thành công!");
        }
    }
}