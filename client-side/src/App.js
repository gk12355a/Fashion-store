import React from "react";
import AppRouter from "./AppRouter";

// 1. Import thư viện và CSS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      {/* 2. Thêm component này (nó sẽ tự động ẩn) */}
      <ToastContainer
        position="top-right"
        autoClose={3000} // Tự động đóng sau 3 giây
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Giữ nguyên Router của bạn */}
      <AppRouter />
    </>
  );
}

export default App;