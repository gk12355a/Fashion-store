import React, { useState, useEffect } from "react";
import api from "../api"; // Import api.js
import OrderList from "../components/Order/OrderList";
import OrderForm from "../components/Order/OrderForm";
import Pagination from "../components/Order/Pagination";
import SearchBar from "../components/Order/SearchBar";
import "../styles/FeaturePage.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sortField, setSortField] = useState("orderDate"); // Default sort by date
  const [sortOrder, setSortOrder] = useState("desc"); // Newest first
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    customerId: "",
    status: "",
    totalAmount: "", // Primarily for display in edit mode
    promotionId: null,
  });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);

  // **Function to fetch orders from the API**
  const fetchOrders = async () => {
    try {
      let response;
      let params = {}; // Khởi tạo params
      let useSearchEndpoint = false; // Flag để biết gọi endpoint nào

      // --- SỬA LẠI LOGIC GỌI API ---
      if (debouncedSearch) {
        // Versuche, das Datum im Format DD/MM/YYYY zu erkennen
        const dateMatch = debouncedSearch.match(
          /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
        );

        if (dateMatch) {
          // --- NẾU LÀ NGÀY ---
          // Chuyển đổi DD/MM/YYYY thành YYYY-MM-DD
          const day = dateMatch[1].padStart(2, "0");
          const month = dateMatch[2].padStart(2, "0");
          const year = dateMatch[3];
          const formattedDate = `${year}-${month}-${day}`;

          // Gọi endpoint chính /orders với tham số orderDate
          params = {
            page: currentPage - 1,
            size: itemsPerPage,
            sort: `${sortField},${sortOrder}`,
            orderDate: formattedDate, // <-- Thêm tham số ngày
          };
          // KHÔNG dùng endpoint /search
          useSearchEndpoint = false;
        } else {
          // --- NẾU KHÔNG PHẢI NGÀY (Logic cũ) ---
          useSearchEndpoint = true; // Sẽ gọi endpoint /search
          const potentialId = parseInt(debouncedSearch);
          if (!isNaN(potentialId)) {
            params.customerId = potentialId; // Tìm theo customerId
          } else {
            params.status = debouncedSearch; // Tìm theo status
          }
        }
      } else {
        // --- NẾU KHÔNG TÌM KIẾM ---
        params = {
          page: currentPage - 1,
          size: itemsPerPage,
          sort: `${sortField},${sortOrder}`,
        };
        useSearchEndpoint = false;
      }

      // --- GỌI API DỰA TRÊN FLAG ---
      if (useSearchEndpoint) {
        response = await api.get("/orders/search", { params }); // Gọi /search
        setOrders(response.data);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        response = await api.get("/orders", { params }); // Gọi /orders
        setOrders(response.data.content);
        setTotalPages(response.data.totalPages);
        // Reset về trang 1 nếu tìm theo ngày trả về ít trang
        if (params.orderDate && response.data.totalPages <= 1) {
          setCurrentPage(1);
        }
      }
      // --- KẾT THÚC SỬA ---
    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn hàng:", error);
      setOrders([]);
      setTotalPages(0);
    }
  };

  // **Effect for debouncing search input**
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to page 1 when search term changes
    }, 500); // 500ms delay
    return () => clearTimeout(timer); // Cleanup timer on unmount or if search changes again
  }, [search]);

  // **Effect to fetch data when dependencies change**
  useEffect(() => {
    fetchOrders();
  }, [currentPage, sortField, sortOrder, debouncedSearch]); // Refetch when page, sort, or debounced search changes

  // **Handler for table sorting**
  const handleSort = (field) => {
    // Chỉ cho phép sort khi KHÔNG tìm kiếm (vì API search không hỗ trợ sort)
    if (debouncedSearch) return;

    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Go to first page when sorting changes
  };

  // **Handler for form input changes**
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // **Validation logic for the form**
  const validate = () => {
    const newErrors = {};
    // Customer ID is only required when adding new
    if (!editingOrder && !formData.customerId?.trim()) {
      newErrors.customerId = "Mã KH không được để trống";
    }
    // Status is only required when editing
    if (editingOrder && !formData.status?.trim()) {
      newErrors.status = "Trạng thái không được để trống";
    }
    // Validate promotionId if entered (basic check if it's a number)
    if (
      !editingOrder &&
      formData.promotionId &&
      isNaN(Number(formData.promotionId))
    ) {
      newErrors.promotionId = "Mã KM phải là số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // **Handler for saving new or edited order**
  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (editingOrder) {
        // PUT request: Only update the status
        await api.put(`/orders/${editingOrder.id}`, {
          status: formData.status,
        });
      } else {
        // POST request: Send customerId and optional promotionId
        // Backend handles default status and totalAmount=0
        await api.post("/orders", {
          customerId: formData.customerId,
          promotionId: formData.promotionId
            ? Number(formData.promotionId)
            : null,
        });
      }
      fetchOrders(); // Reload data
      setShowModal(false); // Close modal
      setEditingOrder(null); // Reset editing state
    } catch (error) {
      console.error("Error saving order:", error);
      // TODO: Display error to user (e.g., customer not found, promotion expired)
      alert(
        `Lỗi khi lưu đơn hàng: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // **Handler for opening the "Add New" modal**
  const handleAddNew = () => {
    setEditingOrder(null);
    // Reset form for adding new order
    setFormData({
      customerId: "",
      status: "",
      totalAmount: "",
      promotionId: null,
    });
    setErrors({}); // Clear previous errors
    setShowModal(true);
  };

  // **Handler for opening the "Edit" modal**
  const handleEdit = (order) => {
    setEditingOrder(order);
    // Map API data (order) to form state (formData)
    setFormData({
      customerId: order.customerId,
      status: order.status,
      totalAmount: order.totalAmount, // For display purposes
      promotionId: order.promotion ? order.promotion.id : null,
    });
    setErrors({}); // Clear previous errors
    setShowModal(true);
  };

  // **Handler for deleting an order**
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Bạn có chắc muốn xóa đơn hàng này? Lưu ý: Hành động này có thể bị chặn nếu đơn hàng đã có thanh toán."
      )
    ) {
      try {
        await api.delete(`/orders/${id}`);
        fetchOrders(); // Reload data
      } catch (error) {
        console.error("Error deleting order:", error);
        alert(
          `Không thể xóa đơn hàng: ${
            error.response?.data?.message ||
            "Có thể đơn hàng đã được thanh toán hoặc có lỗi khác."
          }`
        );
      }
    }
  };

  // **JSX Rendering**
  return (
    <div className="feature-page">
      <h2>Danh sách đơn hàng</h2>
      <SearchBar search={search} setSearch={setSearch} onAdd={handleAddNew} />

      <OrderList
        orders={orders}
        handleSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage} // Pass setCurrentPage as onPageChange
      />

      <OrderForm
        show={showModal}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={() => {
          setShowModal(false);
          setEditingOrder(null);
        }} // Also reset editing state on cancel
        editing={editingOrder}
      />
    </div>
  );
}
