import React from 'react';
// import './ProductToolbar.css'; // <- ĐÃ XÓA

// --- Định nghĩa lớp Tailwind ---
const toolbarClass = "flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg mb-5 flex-wrap gap-4";
const sortOptionsClass = "flex items-center gap-2.5 flex-wrap";
const sortLabelClass = "text-[15px] font-medium text-gray-800 mr-1.5";
const baseFormControlClass = "py-2 px-3.5 border border-gray-300 bg-white rounded-md cursor-pointer text-sm transition-all duration-200 ease-in-out text-gray-800 hover:border-gray-400 hover:bg-gray-50";
const baseSortBtnClass = `${baseFormControlClass}`;
const baseSortSelectClass = `${baseFormControlClass} pr-8`; // Thêm padding cho mũi tên dropdown
const activeSortBtnClass = "bg-red-600 text-white border-red-600 font-semibold";
const activeSortSelectClass = "border-red-600 font-semibold ring-2 ring-red-600/20";
const paginationClass = "flex items-center gap-2";
const pageInfoClass = "text-sm font-semibold text-gray-800 bg-white py-2 px-3 rounded-md border border-gray-300";
const pageNavClass = "py-2 px-3 border border-gray-300 bg-white rounded-md cursor-pointer font-semibold disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200";
// -----------------------------

export default function ProductToolbar({
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  currentPage,
  totalPages,
  setCurrentPage
}) {

  const handleSortButton = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  const handlePriceSortChange = (e) => {
    const value = e.target.value;
    if (value) {
      const [field, order] = value.split(',');
      setSortField(field);
      setSortOrder(order);
    }
  };

  // Sửa hàm này để trả về class active
  const getButtonClass = (field, order) => {
    return `${baseSortBtnClass} ${sortField === field && sortOrder === order ? activeSortBtnClass : ''}`;
  };

  const priceSelectValue = sortField === 'price' ? `price,${sortOrder}` : '';

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
    <div className={toolbarClass}>
      {/* ----- KHU VỰC SẮP XẾP ----- */}
      <div className={sortOptionsClass}>
        <span className={sortLabelClass}>Sắp xếp theo</span>
        <button
          className={getButtonClass('id', 'desc')}
          onClick={() => handleSortButton('id', 'desc')}
        >
          Mới Nhất
        </button>
        <button
          className={getButtonClass('id', 'asc')}
          onClick={() => handleSortButton('id', 'asc')}
        >
          Cũ Nhất
        </button>
        <button
          className={getButtonClass('name', 'asc')}
          onClick={() => handleSortButton('name', 'asc')}
        >
          Tên (A-Z)
        </button>
        <button
          className={getButtonClass('stockQuantity', 'asc')}
          onClick={() => handleSortButton('stockQuantity', 'asc')}
        >
          Tồn kho (Ít)
        </button>

        {/* Dropdown "Giá" */}
        <select
          value={priceSelectValue}
          onChange={handlePriceSortChange}
          className={`${baseSortSelectClass} ${sortField === 'price' ? activeSortSelectClass : ''}`}
        >
          <option value="" disabled>Giá</option>
          <option value="price,asc">Giá: Thấp đến Cao</option>
          <option value="price,desc">Giá: Cao đến Thấp</option>
        </select>
      </div>

      {/* ----- KHU VỰC PHÂN TRANG ----- */}
      <div className={paginationClass}>
        <span className={pageInfoClass}>{totalPages > 0 ? currentPage : 0}/{totalPages}</span>
        <button 
          onClick={handlePrev} 
          disabled={currentPage === 1 || totalPages === 0}
          className={pageNavClass}
        >
          &lt;
        </button>
        <button 
          onClick={handleNext} 
          disabled={currentPage === totalPages || totalPages === 0}
          className={pageNavClass}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}