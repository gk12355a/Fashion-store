import React from 'react';

// --- Định nghĩa lớp Tailwind ---
const toolbarClass = "flex justify-between items-center py-3 px-4 bg-[#f8f9fa] rounded-lg mb-5 flex-wrap gap-4 shadow-md border border-gray-200 font-['Helvetica_Neue',_'Arial',_sans-serif]";
const sortOptionsClass = "flex items-center gap-2.5 flex-wrap";
const sortLabelClass = "text-[15px] font-medium text-[#7B0323] mr-1.5 font-['Helvetica_Neue',_'Arial',_sans-serif]";
const baseFormControlClass = "py-2 px-3.5 border border-gray-300 bg-white rounded-md cursor-pointer text-sm transition-all duration-200 ease-in-out text-[#7B0323] hover:border-[#7B0323] hover:bg-[#f8f9fa] font-['Helvetica_Neue',_'Arial',_sans-serif] font-medium";
// const baseSortBtnClass = `${baseFormControlClass}`; // Không cần nữa
const baseSortSelectClass = `${baseFormControlClass} pr-8`;
// const activeSortBtnClass = "bg-red-600 text-white border-red-600 font-semibold"; // Không cần nữa
const activeSortSelectClass = "border-[#7B0323] font-semibold ring-2 ring-[#7B0323]/20 bg-[#f8f9fa]";
const paginationClass = "flex items-center gap-2";
const pageInfoClass = "text-sm font-semibold text-[#7B0323] bg-white py-2 px-3 rounded-md border border-[#7B0323] font-['Helvetica_Neue',_'Arial',_sans-serif]";
const pageNavClass = "py-2 px-3 border border-[#7B0323] bg-white rounded-md cursor-pointer font-semibold text-[#7B0323] hover:bg-[#7B0323] hover:text-white transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200 disabled:hover:bg-gray-100 disabled:hover:text-gray-400 font-['Helvetica_Neue',_'Arial',_sans-serif]";
// -----------------------------

export default function CustomerToolbar({
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  currentPage,
  totalPages,
  setCurrentPage
}) {

  // 1. Dùng MỘT hàm handler duy nhất
  const handleSortChange = (e) => {
    const value = e.target.value; 
    if (value) {
      const [field, order] = value.split(',');
      setSortField(field);
      setSortOrder(order);
    }
  };

  // 2. Dùng MỘT biến value duy nhất, mặc định là 'name,asc'
  const currentSortValue = sortField ? `${sortField},${sortOrder}` : 'name,asc';

  // (Các hàm getNameButtonClass và pointsSelectValue không cần nữa)

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
        
        {/* 3. Gộp thành MỘT select box */}
        <select
          value={currentSortValue}
          onChange={handleSortChange}
          className={`${baseSortSelectClass} ${activeSortSelectClass}`}
        >
          <option value="name,asc">Tên (A-Z)</option>
          <option value="name,desc">Tên (Z-A)</option>
          <option value="rewardPoints,desc">Điểm: Cao đến Thấp</option>
          <option value="rewardPoints,asc">Điểm: Thấp đến Cao</option>
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