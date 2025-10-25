// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  // --- Định nghĩa lớp Tailwind mới, đồng bộ với Header ---

  // Toàn bộ footer 
  const footerClass =
    "bg-[#7B0323] text-white pt-12 px-6 pb-6 mt-auto font-['Helvetica_Neue',_'Arial',_sans-serif] shadow-inner border-t-2 border-[#5a0219]";

  // Khu vực nội dung chính
  const contentClass =
    "flex justify-around flex-wrap max-w-6xl mx-auto mb-10 gap-8 text-[15px] font-medium";

  // Cột nội dung
  const colClass = "flex-1 min-w-[250px] m-2.5";

  // Tiêu đề mỗi cột 
  const colTitleClass =
    "text-white text-lg font-bold mb-5 relative uppercase tracking-wide after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:bg-gradient-to-r after:from-white after:to-[#ff4757] after:h-0.5 after:w-16";

  // Đoạn mô tả 
  const colTextClass = "text-sm leading-relaxed text-white font-light opacity-90";

  // Item trong danh sách 
  const colListItemClass = "text-sm text-white mb-2.5 font-light opacity-90";

  // Liên kết mạng xã hội 
  const socialLinkClass =
    "inline-block mr-4 text-white no-underline text-sm font-medium transition-colors duration-300 hover:text-[#ff4757] hover:underline";

  // Đáy footer
  const bottomClass =
    "border-t border-[#5a0219] pt-5 mt-8 text-center text-xs text-white font-light opacity-80";

  const bottomTextClass = "my-1.5";

  return (
    <footer className={footerClass}>
      <div className={contentClass}>
        {/* Cột 1 */}
        <div className={colClass}>
          <h4 className={colTitleClass}>
            {/* Làm nổi bật chữ Vélin*/}
            <span className="bg-gradient-to-r from-white to-[#ff4757] bg-clip-text text-transparent font-bold">
              Vélin
            </span>{" "}
            Shop
          </h4>
          <p className={colTextClass}>
          Chuyên cung cấp các sản phẩm thời trang nam nữ, cập nhật xu hướng mới nhất với chất lượng cao và giá cả tốt nhất thị trường hiện nay.
          </p>
        </div>

        {/* Cột 2 */}
        <div className={colClass}>
          <h4 className={colTitleClass}>Liên hệ</h4>
          <ul className="list-none p-0">
            <li className={colListItemClass}>Địa điểm: 80 Dịch Vọng Hậu</li>
            <li className={colListItemClass}>Hotline: 0823 855 518</li>
            <li className={colListItemClass}>Email: contact@velinshop.vn</li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div className={colClass}>
          <h4 className={colTitleClass}>Theo dõi chúng tôi</h4>
          <div className="social-links">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={socialLinkClass}
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={socialLinkClass}
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className={socialLinkClass}
            >
              TikTok
            </a>
          </div>
        </div>
      </div>

      {/* Đáy footer */}
      <div className={bottomClass}>
        <p className={bottomTextClass}>
          &copy; {new Date().getFullYear()}{" "}
          <span className="bg-gradient-to-r from-white to-[#ff4757] bg-clip-text text-transparent font-bold">
            Vélin
          </span>{" "}
          Fashion. All rights reserved.
        </p>
        <p className={bottomTextClass}>Designed by CMC Global</p>
      </div>
    </footer>
  );
}
