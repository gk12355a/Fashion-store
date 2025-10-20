export const initialStaffs = [
  { id: 1, name: "Lê Văn Nam", position: "Bán hàng", salary: 8000000, shift: "Ca sáng" },
  { id: 2, name: "Phạm Thu Hà", position: "Thu ngân", salary: 8500000, shift: "Ca chiều" },
  { id: 3, name: "Nguyễn Hữu Tài", position: "Quản lý", salary: 12000000, shift: "Hành chính" },
  { id: 4, name: "Trần Hồng Nhung", position: "Bán hàng", salary: 8200000, shift: "Ca tối" },
  ...Array.from({ length: 26 }).map((_, i) => ({
    id: 5 + i,
    name: `Nhân viên ${i + 1}`,
    position: ["Bán hàng", "Thu ngân", "Quản lý"][i % 3],
    salary: 7000000 + Math.floor(Math.random() * 6000000),
    shift: ["Ca sáng", "Ca chiều", "Ca tối", "Hành chính"][i % 4],
  })),
];
