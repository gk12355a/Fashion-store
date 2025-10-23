// src/components/Order/SearchBar.jsx
import React from 'react';

const SearchIcon = () => (
  <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
  </svg>
);

export default function SearchBarOrder({
  search,
  setSearch,
  onAdd, // Prop là 'onAdd'
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      {/* ----- KHU VỰC TÌM KIẾM ----- */}
      <div className="relative w-full md:flex-grow">
        <SearchIcon />
        <input
          type="text"
          placeholder="Tìm theo Mã KH, Trạng thái, Ngày (DD/MM/YYYY)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-3 pl-11 pr-4 bg-[#D4E6C4] rounded-full border border-gray-300 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B2C4A3]/50 focus:border-[#B2C4A3] transition duration-200"
          autoComplete="off"
        />
      </div>

      {/* ----- KHU VỰC THÊM MỚI ----- */}
      <button 
        onClick={onAdd}
        className="w-full md:w-auto py-3 px-6 bg-[#D4E6C4] rounded-full font-semibold text-gray-800 border border-gray-300 hover:bg-[#B2C4A3] hover:text-white transition duration-200 shadow-sm flex-shrink-0"
      >
        + Tạo đơn hàng
      </button>
    </div>
  );
}