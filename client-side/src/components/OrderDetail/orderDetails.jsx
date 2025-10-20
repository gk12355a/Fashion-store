export const initialOrderDetails = [
  { id: 1, orderId: 1, productId: 1, quantity: 2, unitPrice: 150000 },
  { id: 2, orderId: 1, productId: 7, quantity: 1, unitPrice: 230000 },
  { id: 3, orderId: 2, productId: 2, quantity: 2, unitPrice: 160000 },
  { id: 4, orderId: 3, productId: 3, quantity: 1, unitPrice: 350000 },
  { id: 5, orderId: 3, productId: 6, quantity: 1, unitPrice: 450000 },
  { id: 6, orderId: 4, productId: 4, quantity: 1, unitPrice: 320000 },
  { id: 7, orderId: 5, productId: 5, quantity: 1, unitPrice: 280000 },
  { id: 8, orderId: 5, productId: 8, quantity: 1, unitPrice: 250000 },
  // Thêm dữ liệu mẫu ngẫu nhiên để phân trang
  ...Array.from({ length: 22 }).map((_, i) => ({
    id: 9 + i,
    orderId: Math.floor(Math.random() * 10) + 1,
    productId: Math.floor(Math.random() * 15) + 1,
    quantity: Math.floor(Math.random() * 5) + 1,
    unitPrice: 100000 + Math.floor(Math.random() * 400000),
  })),
];
