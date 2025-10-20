import React, { useState, useEffect } from "react";
import api from "../api";
import SearchBarProduct from "../components/Product/SearchBar";
import ProductTable from "../components/Product/ProductTable";
import PaginationProduct from "../components/Product/Pagination";
import ProductForm from "../components/Product/ProductForm";
import "../styles/FeaturePage.css";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    imageUrl: "", name: "", type: "", size: "", color: "", price: "", stockQuantity: "",
  });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [file, setFile] = useState(null);

  // 5. HÀM TẢI DỮ LIỆU (GET) - ĐÃ SỬA
  const fetchProducts = async () => {
    try {
      let response;

      // --- SỬA LOGIC TÌM KIẾM ---
      if (debouncedSearch) {
        // 1. NẾU CÓ TÌM KIẾM: Gọi endpoint /search với tham số 'q'
        response = await api.get("/products/search", {
          params: {
            q: debouncedSearch,
          },
        });
        
        // Dựa trên test curl của bạn, API này trả về một MẢNG (Array)
        setProducts(response.data); 
        // Vì API search không phân trang (dựa theo test), ta set 1 trang
        setTotalPages(1); 
        setCurrentPage(1);

      } else {
        // 2. NẾU KHÔNG TÌM KIẾM: Gọi endpoint /products (phân trang)
        response = await api.get("/products", {
          params: {
            page: currentPage - 1,
            size: itemsPerPage,
            sort: `${sortField},${sortOrder}`,
          },
        });
        
        // API này trả về một ĐỐI TƯỢNG (Page)
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
      }
      // --- KẾT THÚC SỬA ---

    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
      setProducts([]); // Clear danh sách nếu lỗi
      setTotalPages(0);
    }
  };

  // 6. TẠO HIỆU ỨNG DEBOUNCE (Giữ nguyên)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
    }, 500); 

    return () => clearTimeout(timer);
  }, [search]); 

  // 7. TỰ ĐỘNG GỌI API (Giữ nguyên)
  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortField, sortOrder, debouncedSearch]); // Lắng nghe debouncedSearch

  const handleSort = (field) => {
    // Chỉ cho phép sort khi không tìm kiếm
    // (Vì API search của bạn không hỗ trợ sort)
    if (debouncedSearch) return; 

    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // ... (Các hàm handleSave, handleDelete, handleChange, v.v. giữ nguyên) ...
  const handleSave = async () => {
    // ... (Validate logic) ...

    const data = new FormData();

    // Đổi tên trường cho khớp Backend DTO (stock -> stockQuantity)
    const productData = {
      name: formData.name,
      type: formData.type,
      size: formData.size,
      color: formData.color,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity), // Đổi từ formData.stock
    };
    data.append(
      "product",
      new Blob([JSON.stringify(productData)], { type: "application/json" })
    );

    if (file) {
      data.append("file", file);
    }

    try {
      if (editingProduct) {
        // --- PUT (Sửa) ---
        await api.put(`/products/${editingProduct.id}`, data, {
          // Dùng 'api'
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // --- POST (Thêm mới) ---
        await api.post("/products", data, {
          // Dùng 'api'
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchProducts(); // Tải lại danh sách
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      try {
        await api.delete(`/products/${id}`); // Dùng 'api'
        fetchProducts(); // Tải lại
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
      }
    }
  };
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Tên không được để trống";
    if (formData.price === "" || Number(formData.price) < 0)
      newErrors.price = "Giá phải ≥ 0";
    // Đổi tên trường
    if (formData.stockQuantity === "" || Number(formData.stockQuantity) < 0)
      newErrors.stockQuantity = "Số lượng phải ≥ 0";
    if (!editingProduct && !file) newErrors.file = "Ảnh sản phẩm là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleAddNew = () => {
    setEditingProduct(null);
    // Đổi tên trường
    setFormData({
      imageUrl: "",
      name: "",
      type: "",
      size: "",
      color: "",
      price: "",
      stockQuantity: "",
    });
    setFile(null);
    setErrors({});
    setShowModal(true);
  };
  const handleEdit = (p) => {
    setEditingProduct(p);
    // Map DTO từ backend sang form
    setFormData({
      imageUrl: p.imageUrl,
      name: p.name,
      type: p.type,
      size: p.size,
      color: p.color,
      price: p.price,
      stockQuantity: p.stockQuantity, // Khớp tên DTO
    });
    setFile(null);
    setErrors({});
    setShowModal(true);
  };

  // --- JSX (Không đổi) ---
  return (
    <div className="feature-page">
      <h2>Danh sách sản phẩm</h2>
      <SearchBarProduct
        search={search}
        setSearch={setSearch}
        onAdd={handleAddNew}
      />

      <ProductTable
        products={products}
        handleSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <PaginationProduct
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <ProductForm
        show={showModal}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onFileChange={handleFileChange}
        onSave={handleSave}
        onCancel={() => {
          setShowModal(false);
          setEditingProduct(null);
        }}
        editing={editingProduct}
      />
    </div>
  );
}