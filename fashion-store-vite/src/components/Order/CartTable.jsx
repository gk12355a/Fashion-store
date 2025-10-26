import React from 'react';


/**
 * Bảng hiển thị các sản phẩm trong giỏ hàng (bên trong OrderForm Modal)
 * @param {array} items - Danh sách cartItems
 * * @param {function} onRemove - Hàm callback khi bấm nút Xóa
 */
export default function CartTable({ items, onRemove }) {
  if (items.length === 0) {
    return (
      // .cart-empty
      <div className="my-2.5 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center text-base text-gray-500">
        Giỏ hàng đang trống. Vui lòng thêm sản phẩm.
      </div>
    );
  }

  // --- Định nghĩa lớp Tailwind ---
  const wrapperClass = "w-full max-h-60 overflow-y-auto border-2 border-gray-200 rounded-xl bg-gray-50 my-2.5";
  const tableClass = "w-full border-collapse font-poppins text-sm";
  const theadClass = "hidden md:table-header-group bg-gray-50 border-b-2 border-gray-300 sticky top-0 z-10";
  const thClass = "py-3 px-4 text-left font-semibold text-gray-800";
  
  // Responsive: block layout on mobile, table-row on desktop
  const trClass = "block mb-2.5 overflow-hidden rounded-lg border border-gray-300 md:table-row md:mb-0 md:border-none md:border-b md:border-gray-200 md:hover:bg-gray-100 md:even:bg-gray-50";
  
  // Responsive: block with "data-label" on mobile, table-cell on desktop
  const tdClass = "align-middle text-gray-600 block relative border-b border-gray-200 py-3 px-4 pl-[50%] text-right last:border-b-0 md:table-cell md:border-b md:py-3 md:px-4 md:text-left md:pl-4";
  
  // Replicates the ::before pseudo-element for data-label
  const DataLabel = ({ label }) => (
    <span className="absolute left-4 w-[calc(50%-2rem)] text-left font-semibold text-gray-800 md:hidden">
      {label}
    </span>
  );
  // -----------------------------

  return (
    <div className={wrapperClass}>
      <table className={tableClass}>
        <thead className={theadClass}>
          <tr>
            <th className={thClass}>Sản phẩm</th>
            <th className={thClass}>Đơn giá</th>
            <th className={thClass}>Số lượng</th>
            <th className={thClass}>Thành tiền</th>
            <th className={thClass}>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.productId} className={trClass}>
              
              <td className={tdClass}>
                <DataLabel label="Sản phẩm" />
                {item.name}
              </td>
              
              <td className={tdClass}>
                <DataLabel label="Đơn giá" />
                {item.unitPrice.toLocaleString()} đ
              </td>
              
              <td className={tdClass}>
                <DataLabel label="Số lượng" />
                {item.quantity}
              </td>
              
              {/* .cell-total */}
              <td className={`${tdClass} font-semibold text-green-600 md:text-right md:pr-5`}>
                <DataLabel label="Thành tiền" />
                {(item.unitPrice * item.quantity).toLocaleString()} đ
              </td>
              
              <td className={tdClass}>
                <DataLabel label="Xóa" />
                <button
                  // .cart-remove-btn
                  className="cursor-pointer border-none bg-none p-0 px-1 text-2xl font-semibold leading-none text-red-600 transition-transform duration-200 ease-in-out hover:scale-125"
                  onClick={() => onRemove(item.productId)}
                >
                  &times;
                </button>
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}