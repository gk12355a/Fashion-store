// src/components/Footer.jsx
import React from 'react';
// import '../styles/Footer.css'; // <- ĐÃ XÓA

export default function Footer() {
  
  // --- Định nghĩa các lớp Tailwind (Dịch từ Footer.css) ---
  
  // .footer (thay bg, text color)
  const footerClass = "bg-[#B2C4A3] text-gray-800 pt-10 px-5 pb-5 mt-auto font-poppins";
  
  // .footer-content
  const contentClass = "flex justify-around flex-wrap max-w-6xl mx-auto mb-8 gap-5";
  
  // .footer-col
  const colClass = "flex-1 min-w-[250px] m-2.5";
  
  // .footer-col h4 (thay text color)
  const colTitleClass = "text-gray-900 text-base font-semibold mb-5 relative uppercase after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:bg-red-600 after:h-0.5 after:w-12";
  
  // .footer-col p (thay text color)
  const colTextClass = "text-sm leading-relaxed text-gray-700";
  
  // .footer-col ul li (thay text color)
  const colListItemClass = "text-sm text-gray-700 mb-2.5";
  
  // .social-links a (thay text color)
  const socialLinkClass = "inline-block mr-4 text-gray-700 no-underline text-sm transition-colors duration-300 hover:text-gray-900";
  
  // .footer-bottom (thay border/text color)
  const bottomClass = "border-t border-gray-400 pt-5 mt-5 text-center text-xs text-gray-600";
  
  // .footer-bottom p
  const bottomTextClass = "my-1.5";
  
  // --- Kết thúc định nghĩa lớp ---

  return (
    <footer className={footerClass}>
      <div className={contentClass}>
        
        <div className={colClass}>
          <h4 className={colTitleClass}>Về Vélin Shop</h4>
          <p className={colTextClass}>Chuyên cung cấp các sản phẩm thời trang nam nữ, xu hướng mới nhất với chất lượng và giá cả tốt nhất thị trường.</p>
        </div>

        <div className={colClass}>
          <h4 className={colTitleClass}>Liên hệ</h4>
          <ul className="list-none p-0">
            <li className={colListItemClass}>🏢 Địa điểm: 80 Dịch Vọng Hậu</li>
            <li className={colListItemClass}>📱 Hotline: 363636363636</li>
            <li className={colListItemClass}>✉️ Email: hotro36@velinshop.vn</li>
          </ul>
        </div>

        <div className={colClass}>
          <h4 className={colTitleClass}>Theo dõi chúng tôi</h4>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={socialLinkClass}>Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={socialLinkClass}>Instagram</a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className={socialLinkClass}>TikTok</a>
          </div>
        </div>

      </div>
      <div className={bottomClass}>
        <p className={bottomTextClass}>&copy; {new Date().getFullYear()} Vélin Fashion. All rights reserved.</p>
        <p className={bottomTextClass}>Copyright by CMC Global</p>
      </div>
    </footer>
  );
}