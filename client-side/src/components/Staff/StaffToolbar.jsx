import React from 'react';
import '../Product/ProductToolbar.css'; // Dùng chung CSS

export default function StaffToolbar({
  sortField, sortOrder, setSortField, setSortOrder,
  currentPage, totalPages, setCurrentPage
}) {

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value) {
      const [field, order] = value.split(',');
      setSortField(field); setSortOrder(order);
    }
  };
  const currentSortValue = sortField ? `${sortField},${sortOrder}` : 'name,asc'; // Mặc định tên A-Z
  const handlePrev = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };

  return (
    <div className="product-toolbar">
      {/* --- Sắp xếp --- */}
      <div className="sort-options">
        <span>Sắp xếp theo</span>
        <select value={currentSortValue} onChange={handleSortChange} className="sort-select active-select">
          <option value="name,asc">Tên (A-Z)</option>
          <option value="name,desc">Tên (Z-A)</option>
          <option value="salary,desc">Lương (Cao-Thấp)</option>
          <option value="salary,asc">Lương (Thấp-Cao)</option>
          <option value="workShift,asc">Ca làm việc</option>
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