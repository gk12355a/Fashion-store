// src/components/OrderDetail/SearchBarOrderDetail.jsx
import React from 'react';

const SearchIcon = () => (
  <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
  </svg>
);

// File này không có logic autocomplete
export default function SearchBarOrderDetail({
  search,
  setSearch,
  onAdd, // Prop là 'onAdd'
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 font-['Helvetica_Neue',_'Arial',_sans-serif]">
      {/* ----- KHU VỰC TÌM KIẾM ----- */}
      <div className="relative w-full md:flex-grow">
        <SearchIcon />
        <input
          type="text"
          placeholder="Tìm chi tiết theo Mã Đơn Hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-3 pl-11 pr-4 bg-white rounded-full border-2 border-gray-700/20 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700/30 focus:border-gray-700 transition duration-300 ease-in-out font-medium shadow-sm"
          autoComplete="off"
        />
      </div>

      {/* ----- KHU VỰC THÊM MỚI ----- */}
      <button 
        onClick={onAdd}
        className="w-full md:w-auto py-3 px-6 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full font-semibold text-white border-2 border-gray-800 hover:from-[#7B0323] hover:to-[#A0052E] hover:border-[#7B0323] transition duration-300 ease-in-out shadow-sm flex-shrink-0 font-['Helvetica_Neue',_'Arial',_sans-serif]"
      >
        + Thêm chi tiết
      </button>
    </div>
  );
}