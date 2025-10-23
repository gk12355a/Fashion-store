import React from "react";
// import '../Product/ProductToolbar.css'; // <- ĐÃ XÓA

// --- Định nghĩa lớp Tailwind ---
const toolbarClass =
  "flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg mb-5 flex-wrap gap-4";
const sortOptionsClass = "flex items-center gap-2.5 flex-wrap";
const sortLabelClass = "text-[15px] font-medium text-gray-800 mr-1.5";
const baseFormControlClass =
  "py-2 px-3.5 border border-gray-300 bg-white rounded-md cursor-pointer text-sm transition-all duration-200 ease-in-out text-gray-800 hover:border-gray-400 hover:bg-gray-50";
const baseSortBtnClass = `${baseFormControlClass}`;
const baseSortSelectClass = `${baseFormControlClass} pr-8`;
const activeSortBtnClass = "bg-red-600 text-white border-red-600 font-semibold";
const activeSortSelectClass =
  "border-red-600 font-semibold ring-2 ring-red-600/20";
const paginationClass = "flex items-center gap-2";
const pageInfoClass =
  "text-sm font-semibold text-gray-800 bg-white py-2 px-3 rounded-md border border-gray-300";
const pageNavClass =
  "py-2 px-3 border border-gray-300 bg-white rounded-md cursor-pointer font-semibold disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200";
// -----------------------------

export default function CustomerToolbar({
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  const handleNameSort = () => {
    setSortField("name");
    setSortOrder("asc");
  };

  const handlePointsSortChange = (e) => {
    const value = e.target.value;
    if (value) {
      const [field, order] = value.split(",");
      setSortField(field);
      setSortOrder(order);
    }
  };

  // Sửa hàm này để trả về class active
  const getNameButtonClass = () => {
    return `${baseSortBtnClass} ${
      sortField === "name" ? activeSortBtnClass : ""
    }`;
  };

  const pointsSelectValue =
    sortField === "rewardPoints" ? `rewardPoints,${sortOrder}` : "";

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

        <select
          value={`${sortField},${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split(",");
            handleSortButton(field, order);
          }}
          className={`${baseSortSelectClass} ${activeSortSelectClass}`}
        >
          <option value="" disabled>
            -- Chọn cách sắp xếp --
          </option>
          <option value="name,asc">Tên (A-Z)</option>
          <option value="rewardPoints,asc">Điểm: Thấp đến Cao</option>
          <option value="rewardPoints,desc">Điểm: Cao đến Thấp</option>
        </select>
      </div>

      {/* ----- KHU VỰC PHÂN TRANG ----- */}
      <div className={paginationClass}>
        <span className={pageInfoClass}>
          {totalPages > 0 ? currentPage : 0}/{totalPages}
        </span>
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
