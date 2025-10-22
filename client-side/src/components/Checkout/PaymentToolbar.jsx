import React from 'react';
import '../Product/ProductToolbar.css'; // Dùng chung CSS

export default function PaymentToolbar({
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  currentPage,
  totalPages,
  setCurrentPage
}) {

  // Xử lý khi chọn cách sắp xếp
  const handleSortChange = (e) => {
    const value = e.target.value; // 'field,order'
    if (value) {
      const [field, order] = value.split(',');
      setSortField(field);
      setSortOrder(order);
    }
  };

  // Giá trị hiện tại của dropdown sort
  const currentSortValue = sortField ? `${sortField},${sortOrder}` : 'paymentDate,desc'; // Mặc định mới nhất

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="product-toolbar">
      {/* --- Sắp xếp --- */}
      <div className="sort-options">
        <span>Sắp xếp theo</span>
        <select
          value={currentSortValue}
          onChange={handleSortChange}
          className="sort-select active-select"
        >
          <option value="paymentDate,desc">Ngày TT (Mới nhất)</option>
          <option value="paymentDate,asc">Ngày TT (Cũ nhất)</option>
          <option value="amount,desc">Số tiền (Cao-Thấp)</option>
          <option value="amount,asc">Số tiền (Thấp-Cao)</option>
        </select>
      </div>

      {/* --- Phân Trang --- */}
      <div className="pagination-controls" style={{ marginLeft: 'auto' }}>
        <span className="page-info">{totalPages > 0 ? currentPage : 0}/{totalPages}</span>
        <button onClick={handlePrev} disabled={currentPage === 1 || totalPages === 0} className="page-nav">&lt;</button>
        <button onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0} className="page-nav">&gt;</button>
      </div>
    </div>
  );
}