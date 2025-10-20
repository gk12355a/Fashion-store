import React from "react";
import "../Pagination.css";

// Sửa tên prop: setCurrentPage -> onPageChange
export default function Pagination({ totalPages, currentPage, onPageChange }) {
  // Chỉ hiển thị nút nếu có nhiều hơn 1 trang
  if (totalPages <= 1) {
      return null;
  }
  
  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={currentPage === i + 1 ? "active" : ""}
          onClick={() => onPageChange(i + 1)} // Gọi đúng tên prop
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}