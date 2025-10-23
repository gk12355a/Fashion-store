// src/AppRouter.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer"; // [1] Import Footer
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CustomersPage from "./pages/CustomersPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrdersDetailsPage";
import StaffPage from "./pages/StaffPage";
import CheckoutPage from "./pages/CheckoutPage";
import PromotionsPage from "./pages/PromotionsPage";

export default function AppRouter() {
  return (
    <Router>
      {/* [2] Thêm một div bọc ngoài để làm sticky footer */}
      <div className="app-container">
        <Header />
        
        {/* [3] Bọc Routes bằng <main> để nội dung chính phát triển */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sanpham" element={<ProductsPage />} />
            <Route path="/khachhang" element={<CustomersPage />} />
            <Route path="/donhang" element={<OrdersPage />} />
            <Route path="/chitietdonhang" element={<OrderDetailsPage />} />
            <Route path="/nhanvien" element={<StaffPage />} />
            <Route path="/thanhtoan" element={<CheckoutPage />} />
            <Route path="/khuyenmai" element={<PromotionsPage />} />
          </Routes>
        </main>
        
        <Footer /> {/* [4] Thêm Footer vào đây */}
      </div>
    </Router>
  );
}