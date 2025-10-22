import React, { useState, useEffect } from "react";
import api from "../api";
import SearchBar from "../components/Order/SearchBar";
import OrderList from "../components/Order/OrderList";
import OrderToolbar from "../components/Order/OrderToolbar";
import OrderForm from "../components/Order/OrderForm"; // "Smart Modal"
import "../styles/FeaturePage.css";
import { toast } from "react-toastify";

// Component Form riêng để sửa Status
const EditStatusForm = ({ show, formData, onChange, onSave, onCancel, isSaving }) => {
  if (!show) return null;
  // Giới hạn lựa chọn trạng thái
  const orderStatuses = ["Đang chờ xử lý", "Đã thanh toán"];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Cập nhật trạng thái đơn hàng (ID: {formData.id})</h2>
        <div className="form">
          <div className="form-group">
            <label>Trạng thái mới</label>
            <select name="status" value={formData.status} onChange={onChange}>
              <option value="">-- Chọn trạng thái --</option>
              {orderStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="form-buttons">
            <button className="save-btn" onClick={onSave} disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Cập nhật'}
            </button>
            <button className="cancel-btn" onClick={onCancel} disabled={isSaving}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
};
// KẾT THÚC FORM SỬA STATUS

export default function OrdersPage() {
  // --- State cho dữ liệu bảng và phân trang/sắp xếp ---
  const [orders, setOrders] = useState([]);
  const [sortField, setSortField] = useState("orderDate"); // Mặc định sort mới nhất
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  // --- State cho tìm kiếm và lọc ---
  const [search, setSearch] = useState(""); // Input từ search bar
  const [debouncedSearch, setDebouncedSearch] = useState(search); // Giá trị search sau debounce
  const [startDate, setStartDate] = useState(""); // Bộ lọc ngày bắt đầu (YYYY-MM-DD)
  const [endDate, setEndDate] = useState(""); // Bộ lọc ngày kết thúc (YYYY-MM-DD)

  // --- State cho các Modal ---
  const [showCreateModal, setShowCreateModal] = useState(false); // Modal tạo đơn (Smart Modal)
  const [showEditModal, setShowEditModal] = useState(false); // Modal sửa status
  const [editFormData, setEditFormData] = useState({ id: null, status: "" }); // Dữ liệu cho modal sửa

  // --- State cho trạng thái loading ---
  const [isSaving, setIsSaving] = useState(false); // Dùng cho modal sửa status
  const [isExporting, setIsExporting] = useState(false); // Dùng cho nút Xuất CSV

  // --- Hàm Fetch Dữ liệu (Gọi API GET /orders) ---
  const fetchOrders = async () => {
    try {
      // 1. Tham số cơ bản: phân trang, sắp xếp
      const params = {
        page: currentPage - 1,
        size: itemsPerPage,
        sort: `${sortField},${sortOrder}`,
      };

      // 2. Thêm tham số lọc nếu có giá trị
      if (debouncedSearch) {
        // Giá trị từ search bar (có thể là Mã KH hoặc Status)
        params.textSearch = debouncedSearch;
      }
      if (startDate) {
        params.startDate = startDate; // Định dạng YYYY-MM-DD
      }
      if (endDate) {
        params.endDate = endDate; // Định dạng YYYY-MM-DD
      }

      // 3. Gọi API Backend (đã hỗ trợ các tham số lọc)
      const response = await api.get("/orders", { params });

      // 4. Cập nhật state với dữ liệu trả về
      setOrders(response.data.content); // Mảng đơn hàng
      setTotalPages(response.data.totalPages); // Tổng số trang

    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn hàng:", error);
      toast.error("Không thể tải danh sách đơn hàng!");
      setOrders([]); // Reset bảng nếu lỗi
      setTotalPages(0);
    }
  };

  // --- UseEffect Hooks ---

  // Debounce Search Input: Chờ người dùng ngừng gõ 500ms rồi mới cập nhật debouncedSearch
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search); // Cập nhật giá trị debounced
      setCurrentPage(1); // Luôn về trang 1 khi thực hiện tìm kiếm/lọc mới
    }, 500);
    return () => clearTimeout(timer); // Hủy timer nếu người dùng gõ tiếp
  }, [search]); // Hook này chạy lại mỗi khi 'search' (giá trị input) thay đổi

  // Fetch Data Trigger: Gọi lại fetchOrders khi các yếu tố phân trang, sắp xếp, lọc thay đổi
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortField, sortOrder, debouncedSearch, startDate, endDate]); // Dependency array

  // --- Các Hàm Xử Lý Sự Kiện ---

  // Xử lý khi người dùng chọn ngày trên Toolbar
  const handleDateChange = (field, value) => {
    if (field === 'startDate') setStartDate(value);
    if (field === 'endDate') setEndDate(value);
    setCurrentPage(1); // Về trang 1 khi thay đổi bộ lọc ngày
  };

  // Xử lý khi người dùng bấm nút "Xuất Báo Cáo"
  const handleExportClick = async () => {
    // Kiểm tra phải chọn đủ 2 ngày
    if (!startDate || !endDate) {
        toast.warn("Vui lòng chọn Ngày bắt đầu và Ngày kết thúc để xuất báo cáo.");
        return;
    }

    setIsExporting(true); // Bật trạng thái loading cho nút
    try {
        // Gọi API /export với startDate và endDate
        const response = await api.get("/orders/export", {
            params: { startDate, endDate },
            responseType: 'blob' // Yêu cầu backend trả về dữ liệu dạng file
        });

        // Xử lý file trả về để tải xuống
        const contentDisposition = response.headers['content-disposition'];
        let filename = "bao-cao-don-hang.csv"; // Tên file mặc định
        if (contentDisposition) {
            // Cố gắng lấy tên file động từ header (nếu backend gửi)
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch && filenameMatch.length > 1) {
                filename = filenameMatch[1];
            }
        }

        // Tạo URL object từ dữ liệu blob (nội dung file CSV)
        const url = window.URL.createObjectURL(
            new Blob([response.data], { type: 'text/csv;charset=utf-8;' }) // Đảm bảo mã hóa UTF-8
        );
        // Tạo thẻ <a> ẩn
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename); // Đặt tên file sẽ tải về
        document.body.appendChild(link);
        link.click(); // Giả lập click để tải file
        link.remove(); // Xóa thẻ <a> ẩn
        window.URL.revokeObjectURL(url); // Giải phóng bộ nhớ của URL object

        toast.success("Xuất báo cáo thành công!");

    } catch (error) {
        console.error("Lỗi khi xuất CSV:", error);
        toast.error("Lỗi khi xuất báo cáo.");
    } finally {
        setIsExporting(false); // Tắt trạng thái loading (dù thành công hay lỗi)
    }
  };

  // Xử lý Lưu đơn hàng MỚI (được gọi bởi OrderForm - Smart Modal)
  const handleSaveCreate = async (requestData) => {
    try {
      await api.post("/orders", requestData); // Gọi API POST mới (/api/v1/orders)
      fetchOrders(); // Tải lại danh sách đơn hàng
      setShowCreateModal(false); // Đóng Smart Modal
      toast.success("Tạo đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
      throw error; // Ném lỗi để OrderForm biết và dừng trạng thái loading
    }
  };

  // Xử lý Lưu cập nhật STATUS (được gọi bởi EditStatusForm)
  const handleSaveEdit = async () => {
    // Validate đơn giản
    if (!editFormData.status) {
      toast.error("Vui lòng chọn trạng thái.");
      return;
    }
    setIsSaving(true); // Bật loading cho nút Lưu của modal Sửa
    try {
      // Gọi API PUT /orders/{id} chỉ với trường status
      await api.put(`/orders/${editFormData.id}`, { status: editFormData.status });
      fetchOrders(); // Tải lại danh sách
      setShowEditModal(false); // Đóng modal Sửa
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSaving(false); // Tắt loading cho nút Lưu
    }
  };

  // Mở modal Thêm mới (Smart Modal)
  const handleAddNew = () => {
    setShowCreateModal(true);
  };

  // Mở modal Sửa Status và điền dữ liệu cũ
  const handleEdit = (order) => {
    setEditFormData({ id: order.id, status: order.status });
    setShowEditModal(true);
  };

  // Xử lý Xóa đơn hàng
  const handleDelete = async (id) => {
    // Hiện cửa sổ xác nhận của trình duyệt
    if (window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")) {
      try {
        await api.delete(`/orders/${id}`); // Gọi API DELETE /orders/{id}
        fetchOrders(); // Tải lại danh sách
        toast.success("Xóa đơn hàng thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
        toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // --- JSX Render ---
  return (
    <div className="feature-page">
      <h2>Danh sách đơn hàng</h2>

      {/* Thanh tìm kiếm */}
      <SearchBar search={search} setSearch={setSearch} onAdd={handleAddNew} />

      {/* Thanh công cụ (Sắp xếp, Lọc ngày, Xuất CSV, Phân trang) */}
      <OrderToolbar
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        // Props cho lọc ngày và export
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
        onExportClick={handleExportClick}
        isExporting={isExporting}
      />

      {/* Bảng danh sách đơn hàng */}
      <OrderList
        orders={orders}
        handleEdit={handleEdit}     // Prop để mở modal sửa status
        handleDelete={handleDelete} // Prop để xóa
      />

      {/* Modal Tạo Đơn Hàng (Smart Modal) */}
      <OrderForm
        show={showCreateModal}
        onSave={handleSaveCreate}     // Prop callback khi lưu thành công
        onCancel={() => setShowCreateModal(false)} // Prop để đóng modal
      />

      {/* Modal Sửa Trạng Thái */}
      <EditStatusForm
        show={showEditModal}
        formData={editFormData}
        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
        onSave={handleSaveEdit}
        onCancel={() => setShowEditModal(false)}
        isSaving={isSaving}
      />
    </div>
  );
}