import axios from 'axios';

// 1. Đọc baseURL từ file .env
const baseURL = import.meta.env.VITE_BACKEND_URL;

// 2. Tạo một instance (thể hiện) của axios
const api = axios.create({
  baseURL: baseURL,
  // (Bạn cũng có thể thêm các cấu hình chung khác ở đây)
});

// 3. Xuất (export) nó ra để toàn bộ ứng dụng có thể dùng
export default api;