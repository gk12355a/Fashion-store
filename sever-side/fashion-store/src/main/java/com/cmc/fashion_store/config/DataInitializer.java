package com.cmc.fashion_store.config;

import com.cmc.fashion_store.model.Promotion;
import com.cmc.fashion_store.repository.PromotionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PromotionRepository promotionRepository;

    public DataInitializer(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    @Override
    public void run(String... args) {
        try {
            // Đợi 2 giây để database kết nối
            Thread.sleep(2000);

            long count = promotionRepository.count();
            System.out.println("📊 Số lượng promotion hiện có: " + count);

            if (count == 0) {
                System.out.println("🚀 Đang tạo dữ liệu mẫu...");

                Promotion p1 = new Promotion();
                p1.setName("Khuyến mãi mùa hè");
                p1.setDiscountValue(20.0);
                p1.setExpiryDate(LocalDateTime.now().plusDays(30));
                p1.setType("PERCENTAGE");
                p1.setDescription("Khuyến mãi đặc biệt cho mùa hè");

                Promotion p2 = new Promotion();
                p2.setName("Giảm giá đầu năm");
                p2.setDiscountValue(50000.0);
                p2.setExpiryDate(LocalDateTime.now().plusDays(60));
                p2.setType("FIXED_AMOUNT");
                p2.setDescription("Chào đón năm mới với ưu đãi lớn");

                promotionRepository.save(p1);
                promotionRepository.save(p2);

                System.out.println("✅ Đã tạo 2 bản ghi mẫu thành công!");
            } else {
                System.out.println("ℹ️  Đã có dữ liệu, bỏ qua tạo mẫu.");
            }
        } catch (Exception e) {
            System.out.println("⚠️  Lỗi khi khởi tạo dữ liệu: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
