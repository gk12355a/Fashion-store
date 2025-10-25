// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  // --- Định nghĩa lớp Tailwind mới, đồng bộ với Header ---

  // Toàn bộ footer
  const footerClass =
    "bg-[#B2C4A3] text-gray-900 pt-12 px-6 pb-6 mt-auto font-poppins shadow-inner border-t-2 border-[#a5b58e]";

  // Khu vực nội dung chính
  const contentClass =
    "flex justify-around flex-wrap max-w-6xl mx-auto mb-10 gap-8 text-[15px] font-semibold";

  // Cột nội dung
  const colClass = "flex-1 min-w-[250px] m-2.5";

  // Tiêu đề mỗi cột
  const colTitleClass =
    "text-gray-900 text-lg font-extrabold mb-5 relative uppercase tracking-wide after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:bg-gradient-to-r after:from-[#567c2d] after:to-[#95b46a] after:h-0.5 after:w-16";

  // Đoạn mô tả
  const colTextClass = "text-sm leading-relaxed text-gray-800 font-medium";

  // Item trong danh sách
  const colListItemClass = "text-sm text-gray-800 mb-2.5 font-medium";

  // Liên kết mạng xã hội
  const socialLinkClass =
    "inline-block mr-4 text-gray-800 no-underline text-sm font-semibold transition-colors duration-300 hover:text-[#567c2d] hover:underline";

  // Đáy footer
  const bottomClass =
    "border-t border-gray-400 pt-5 mt-8 text-center text-xs text-gray-700 font-medium";

  const bottomTextClass = "my-1.5";

  return (
    <footer className={footerClass}>
      <div className={contentClass}>
        {/* Cột 1 */}
        <div className={colClass}>
          <h4 className={colTitleClass}>
            {/* 🌟 Làm nổi bật chữ Vélin */}
            <span className="bg-gradient-to-r from-[#567c2d] to-[#95b46a] bg-clip-text text-transparent font-extrabold">
              Vélin
            </span>{" "}
            Shop
          </h4>
          <p className={colTextClass}>
            Chuyên cung cấp các sản phẩm thời trang nam nữ, xu hướng mới nhất
            với chất lượng và giá cả tốt nhất thị trường.
          </p>
        </div>

        {/* Cột 2 */}
        <div className={colClass}>
          <h4 className={colTitleClass}>Liên hệ</h4>
          <ul className="list-none p-0">
            <li className={colListItemClass}>🏢 Địa điểm: 80 Dịch Vọng Hậu</li>
            <li className={colListItemClass}>📱 Hotline: 082 385 5518</li>
            <li className={colListItemClass}>✉️ Email: hotro36@velinshop.vn</li>
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
          <span className="bg-gradient-to-r from-[#567c2d] to-[#eaebea] bg-clip-text text-transparent font-bold">
            Vélin
          </span>{" "}
          Fashion. All rights reserved.
        </p>
        <p className={bottomTextClass}>Designed by CMC Global</p>
      </div>
    </footer>
  );
}
