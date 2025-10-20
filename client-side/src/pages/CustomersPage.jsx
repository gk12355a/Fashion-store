import React, { useState, useEffect } from "react";
import api from "../api"; 
import SearchBar from "../components/Customer/SearchBar";
import CustomerTable from "../components/Customer/CustomerTable";
import Pagination from "../components/Customer/Pagination";
import CustomerForm from "../components/Customer/CustomerForm";
import "../styles/FeaturePage.css";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "", // Tên form
    email: "",
    membership: "", // Tên form
    points: "", // Tên form
  });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);

  // ... (Hàm fetchCustomers và useEffects giữ nguyên như code trước) ...
  const fetchCustomers = async () => {
    try {
      let response;
      if (debouncedSearch) {
        // Giả sử API Customer của bạn có /search?q=...
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
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách hàng:", error);
      setCustomers([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); 
    }, 500); 

    return () => clearTimeout(timer);
  }, [search]); 

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, sortField, sortOrder, debouncedSearch]); 

  const handleSort = (field) => {
    if (debouncedSearch) return; 
    if (sortField === field)
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // (Hàm validate không cần sửa, vì nó đọc từ formData đã được map)
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên không được để trống";
    // Kiểm tra formData.phone (đã được map)
    if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.phone))
      newErrors.phone = "SĐT không hợp lệ";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    // Kiểm tra formData.membership (đã được map)
    if (!formData.membership.trim())
      newErrors.membership = "Loại thành viên không được để trống";
    if (formData.points === "" || formData.points < 0)
      newErrors.points = "Điểm thưởng phải ≥ 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 9. HÀM LƯU (POST / PUT)
  const handleSave = async () => {
    if (!validate()) return;

    // Map tên trường từ Form (frontend) sang DTO (backend)
    const requestData = {
      name: formData.name,
      phoneNumber: formData.phone, // 'phone' -> 'phoneNumber'
      email: formData.email,
      membershipType: formData.membership, // 'membership' -> 'membershipType'
      rewardPoints: Number(formData.points), // 'points' -> 'rewardPoints'
    };

    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, requestData);
      } else {
        await api.post("/customers", requestData);
      }
      fetchCustomers(); 
      setShowModal(false);
      
    } catch (error) {
      console.error("Lỗi khi lưu khách hàng:", error);
    }
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setFormData({ name: "", phone: "", email: "", membership: "", points: "" });
    setShowModal(true);
  };

  // 10. HÀM SỬA (EDIT) - ĐÂY LÀ CHỖ GÂY LỖI
  const handleEdit = (c) => {
    setEditingCustomer(c);
    // Map DTO (từ API) sang Form (frontend)
    setFormData({
      name: c.name,
      phone: c.phoneNumber, // 'phoneNumber' (từ API) -> 'phone' (state)
      email: c.email,
      membership: c.membershipType, // 'membershipType' (từ API) -> 'membership' (state)
      points: c.rewardPoints, // 'rewardPoints' (từ API) -> 'points' (state)
    });
    setShowModal(true);
  };

  // 11. HÀM XÓA (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khách hàng này không?")) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers(); 
      } catch (error) {
        console.error("Lỗi khi xóa khách hàng:", error);
      }
    }
  };

  // ... (Phần JSX return giữ nguyên) ...
  return (
    <div className="feature-page">
      <h2>Danh sách khách hàng</h2>
      <SearchBar search={search} setSearch={setSearch} onAdd={handleAddNew} />
      <CustomerTable
        customers={customers} 
        handleSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
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