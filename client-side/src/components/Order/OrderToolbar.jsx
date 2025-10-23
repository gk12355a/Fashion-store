import React from "react";
import "../Product/ProductToolbar.css"; // Dùng chung CSS với ProductToolbar

export default function OrderToolbar({
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  currentPage,
  totalPages,
  setCurrentPage,
  startDate,
  endDate,
  onDateChange, // Props cho ngày
  onExportClick,
  isExporting, // Props cho export
}) {
  // Xử lý nút/dropdown Sắp xếp
  const handleSortChange = (e) => {
    const value = e.target.value; // 'field,order'
    if (value) {
      const [field, order] = value.split(",");
      setSortField(field);
      setSortOrder(order);
    }
  };

  // Lấy giá trị hiện tại của select box
  // (Mặc định là "Mới nhất")
  const currentSortValue = sortField
    ? `${sortField},${sortOrder}`
    : "orderDate,desc";

  // Xử lý chuyển trang
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="product-toolbar">
      {/* ----- KHU VỰC SẮP XẾP ----- */}
      <div className="sort-options">
        <span>Sắp xếp theo</span>

        {/* Dropdown "Giá" */}
        <select
          value={currentSortValue}
          onChange={handleSortChange}
          className="sort-select active-select" // Luôn active
        >
          <option value="orderDate,desc">Mới nhất</option>
          <option value="orderDate,asc">Cũ nhất</option>
          <option value="totalAmount,desc">Tổng tiền: Cao đến Thấp</option>
          <option value="totalAmount,asc">Tổng tiền: Thấp đến Cao</option>
        </select>
      </div>

      {/* ----- KHU VỰC PHÂN TRANG ----- */}
      <div className="pagination-controls">
        <span className="page-info">
          {totalPages > 0 ? currentPage : 0}/{totalPages}
        </span>
        <button
          onClick={handlePrev}
          disabled={currentPage === 1 || totalPages === 0}
          className="page-nav"
        >
          &lt;
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className="page-nav"
        >
          &gt;
        </button>
      </div>
      
    </div>
  );
}
