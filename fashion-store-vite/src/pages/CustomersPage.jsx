import React, { useState, useEffect } from "react";
import api from "../api";
import SearchBar from "../components/Customer/SearchBarCustomer";
import CustomerTable from "../components/Customer/CustomerTable";
import CustomerToolbar from "../components/Customer/CustomerToolbar";
import CustomerForm from "../components/Customer/CustomerForm";
import Loading from "../components/Loading";
import { toast } from 'react-toastify';

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", membership: "", points: "",
  });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      let response;
      if (debouncedSearch) {
        response = await api.get("/customers/search", {
          params: { q: debouncedSearch },
        });
        setCustomers(response.data);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        response = await api.get("/customers", {
          params: {
            page: currentPage - 1,
            size: itemsPerPage,
            sort: `${sortField},${sortOrder}`,
          },
        });
        setCustomers(response.data.content);
        setTotalPages(response.data.totalPages);
      }
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách hàng:", error);
      toast.error("Không thể tải danh sách khách hàng!");
      setCustomers([]);
      setTotalPages(0);
      // setLoading(false);
    }
  };

  // useEffect cho tìm kiếm (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // useEffect cho tải dữ liệu (khi sort, page, search thay đổi)
  useEffect(() => {
    setLoading(true);
    fetchCustomers();
  }, [currentPage, sortField, sortOrder, debouncedSearch]);

  // useEffect MỚI cho Autocomplete
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim() === "") {
        setSuggestions([]);
        return;
      }
      try {
        const response = await api.get("/customers/autocomplete", {
          params: { q: search },
        });
        setSuggestions(response.data || []);
      } catch (error) {
        console.error("Lỗi khi tải gợi ý:", error);
        setSuggestions([]);
      }
    };
    const suggestionTimer = setTimeout(fetchSuggestions, 250);
    return () => clearTimeout(suggestionTimer);
  }, [search]);

  // Hàm xử lý Autocomplete
  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    setSuggestions([]);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setSuggestions([]), 150);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên không được để trống";
    if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.phone))
      newErrors.phone = "SĐT không hợp lệ (10 số, bắt đầu 03|05|07|08|09)";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.membership)
      newErrors.membership = "Vui lòng chọn loại thành viên";
    if (formData.points === "" || Number(formData.points) < 0)
      newErrors.points = "Điểm thưởng phải ≥ 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // HÀM LƯU (POST / PUT)
  const handleSave = async () => {
    if (!validate()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    const requestData = {
      name: formData.name,
      phoneNumber: formData.phone,
      email: formData.email,
      membershipType: formData.membership,
      rewardPoints: Number(formData.points),
    };

    try {
      let actionText = "";
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, requestData);
        actionText = "Cập nhật";
      } else {
        await api.post("/customers", requestData);
        actionText = "Thêm mới";
      }
      fetchCustomers();
      setShowModal(false);
      toast.success(`${actionText} khách hàng thành công!`);

    } catch (error) {
      console.error("Lỗi khi lưu khách hàng:", error);
      const msg = error.response?.data?.message || `Lỗi khi ${editingCustomer ? 'cập nhật' : 'thêm'}.`;
      toast.error(msg);
    }
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setFormData({ name: "", phone: "", email: "", membership: "", points: "" });
    setErrors({});
    setShowModal(true);
  };

  // HÀM SỬA (EDIT)
  const handleEdit = (c) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name,
      phone: c.phoneNumber,
      email: c.email,
      membership: c.membershipType,
      points: c.rewardPoints,
    });
    setErrors({});
    setShowModal(true);
  };

  // HÀM XÓA (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khách hàng này không?")) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
        toast.success("Xóa khách hàng thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa khách hàng:", error);
        const msg = error.response?.data?.message || "Không thể xóa khách hàng.";
        toast.error(msg);
      }
    }
  };

  return loading ? (
    <Loading />
  ) : (
    // THAY ĐỔI 1: Áp dụng padding 'p-5' (tương đương 20px)
    <div className="p-5">
      {/* THAY ĐỔI 2: Thêm class Tailwind cho H2 */}
      <h2 className="text-2xl font-bold text-center mt-2 mb-4">
        Danh sách khách hàng
      </h2>

      <SearchBar
        search={search}
        setSearch={setSearch}
        onAdd={handleAddNew}
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
        onBlur={handleSearchBlur}
      />

      <CustomerToolbar
        sortField={sortField}
        sortOrder={sortOrder}
        setSortField={setSortField}
        setSortOrder={setSortOrder}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      <CustomerTable
        customers={customers}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <CustomerForm
        show={showModal}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={() => setShowModal(false)}
        editing={editingCustomer}
      />
    </div>
  );
}