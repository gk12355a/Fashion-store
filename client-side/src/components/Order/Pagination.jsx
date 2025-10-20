import React from "react";
import "../Pagination.css";

export default function Pagination({ totalPages, currentPage, onPageChange }) {
  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={currentPage === i + 1 ? "active" : ""}
          onClick={() => onPageChange(i + 1)} // ✅ gọi đúng prop
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
