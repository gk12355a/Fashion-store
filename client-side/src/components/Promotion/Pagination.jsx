import React from "react";
import "../Pagination.css";

export default function Pagination({ totalPages, currentPage, setCurrentPage }) {
  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => (
        <button key={i} className={currentPage === i + 1 ? "active" : ""} onClick={() => setCurrentPage(i + 1)}>
          {i + 1}
        </button>
      ))}
    </div>
  );
}
