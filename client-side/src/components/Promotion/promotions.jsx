export const initialPromotions = [
  { id: 1, name: "KM1", type: "Giảm giá trực tiếp", discount: 50000, expiry: "2025-12-31" },
  { id: 2, name: "KM2", type: "Giảm %", discount: 10, expiry: "2025-11-30" },
  { id: 3, name: "KM3", type: "Tặng kèm", discount: 0, expiry: "2025-10-20" },
  ...Array.from({ length: 28 }).map((_, i) => ({
    id: 4 + i,
    name: `KM${4 + i}`,
    type: ["Giảm giá trực tiếp", "Giảm %", "Tặng kèm"][i % 3],
    discount: Math.floor(Math.random() * 100000),
    expiry: new Date(2025, i % 12, 5 + (i % 20)).toISOString().slice(0, 10),
  })),
];
