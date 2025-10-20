
export const initialPayments = [
  { id: 1, orderCode: "DH001", method: "Tiền mặt", amount: 120000, date: "2025-10-10" },
  { id: 2, orderCode: "DH002", method: "Chuyển khoản", amount: 350000, date: "2025-10-12" },
  { id: 3, orderCode: "DH003", method: "Thẻ tín dụng", amount: 99900, date: "2025-09-20" },
  { id: 4, orderCode: "DH004", method: "Ví điện tử", amount: 450000, date: "2025-10-01" },
  { id: 5, orderCode: "DH005", method: "Tiền mặt", amount: 20000, date: "2025-08-15" },
  ...Array.from({ length: 28 }).map((_, i) => ({
    id: 6 + i,
    orderCode: `DH${String(6 + i).padStart(3, "0")}`,
    method: ["Tiền mặt", "Chuyển khoản", "Thẻ tín dụng", "Ví điện tử"][i % 4],
    amount: Math.floor(Math.random() * 500000),
    date: new Date(2025, 6 + (i % 4), 5 + (i % 20)).toISOString().slice(0, 10),
  })),
];