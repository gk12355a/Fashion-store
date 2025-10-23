// src/components/Footer.jsx
import React from 'react';
import '../styles/Footer.css'; // Chúng ta sẽ tạo file CSS này

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        <div className="footer-col">
          <h4>Về Vélin Shop</h4>
          <p>Chuyên cung cấp các sản phẩm thời trang nam nữ, xu hướng mới nhất với chất lượng và giá cả tốt nhất thị trường.</p>
        </div>

        <div className="footer-col">
          <h4>Liên hệ</h4>
          <ul>
            <li>🏢 Địa điểm: 11 Duy Tân</li>
            <li>📱 Hotline: 0946312372</li>
            <li>✉️ Email: dtkien5@cmcglobal.vn</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Theo dõi chúng tôi</h4>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>
        </div>

      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Vélin Fashion. All rights reserved.</p>
        <p>Copyright by CMC Global</p>
      </div>
    </footer>
  );
}