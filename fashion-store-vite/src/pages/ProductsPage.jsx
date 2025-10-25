import React, { useState, useEffect, useCallback } from "react";
import api from "../api";
import SearchBarProduct from "../components/Product/SearchBarProduct";
import ProductTable from "../components/Product/ProductTable";
// import PaginationProduct from "../components/Product/Pagination";
import ProductForm from "../components/Product/ProductForm";
import ProductToolbar from "../components/Product/ProductToolbar";
import Loading from "../components/Loading"; // <-- 1. IMPORT COMPONENT LOADING

// 1. Import toast
import { toast } from "react-toastify";

export default function ProductPage() {
  // ... (Giữ nguyên các state)
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    imageUrl: "",
    name: "",
    type: "",
    size: "",
    color: "",
    price: "",
    stockQuantity: "",
  });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [file, setFile] = useState(null);
  // 3. State mới cho autocomplete
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true); // <-- 2. THÊM STATE LOADING

  const fetchProducts = async () => {
    try {
      let response;
      if (debouncedSearch) {
        response = await api.get("/products/search", {
          params: { q: debouncedSearch },
        });
        setProducts(response.data);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        response = await api.get("/products", {
          params: {
            page: currentPage - 1,
            size: itemsPerPage,
            sort: `${sortField},${sortOrder}`,
          },
        });
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
      }
      setLoading(false); // <-- 3. SET LOADING = FALSE KHI THÀNH CÔNG
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
      // 2. Thêm toast lỗi khi tải dữ liệu
      toast.error("Không thể tải danh sách sản phẩm!");
      setProducts([]);
      setTotalPages(0);
      setLoading(false); // <-- 4. SET LOADING = FALSE KHI LỖI
    }
  };

  // ... (useEffect cho debounce và fetchProducts giữ nguyên) ...
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true); // <-- 5. SET LOADING = TRUE TRƯỚC KHI GỌI API
    fetchProducts();
  }, [currentPage, sortField, sortOrder, debouncedSearch]);

  // 5. useEffect MỚI cho GỢI Ý (AUTOCOMPLETE)
  // (Lấy danh sách gợi ý khi người dùng gõ)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim() === "") {
        setSuggestions([]); // Ẩn gợi ý nếu ô tìm kiếm trống
        return;
      }
      try {
        // GIẢ ĐỊNH BẠN CÓ API NÀY:
        const response = await api.get("/products/autocomplete", {
          params: { q: search },
        });
        setSuggestions(response.data || []);
      } catch (error) {
        // Không cần báo lỗi ồn ào, chỉ cần log ra
        console.error("Lỗi khi tải gợi ý:", error);
        setSuggestions([]);
      }
    };

    // Tương tự, debounce cho gợi ý (nhanh hơn debounce chính)
    const suggestionTimer = setTimeout(() => {
      fetchSuggestions();
    }, 250); // Debounce 250ms

    return () => clearTimeout(suggestionTimer);
  }, [search]); // Chạy mỗi khi 'search' thay đổi

  // 6. Hàm xử lý khi bấm vào một gợi ý
  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion); // Cập nhật ô tìm kiếm
    setSuggestions([]); // Ẩn danh sách gợi ý
    // debouncedSearch sẽ tự động cập nhật sau 500ms (nhờ useEffect ở mục 4)
  };

  // 7. Hàm xử lý khi blur (click ra ngoài) ô tìm kiếm
  const handleSearchBlur = () => {
    // Thêm delay nhỏ để sự kiện click vào gợi ý kịp chạy
    setTimeout(() => {
      setSuggestions([]);
    }, 150);
  };
  // const handleSort = (field) => {
  //   // ... (Giữ nguyên)
  //   if (debouncedSearch) return;
  //   if (sortField === field) {
  //     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  //   } else {
  //     setSortField(field);
  //     setSortOrder("asc");
  //   }
  // };

  const handleSave = async () => {
    // 3. Thêm toast khi validation frontend thất bại
    if (!validate()) {
      toast.error("Vui lòng kiểm tra lại thông tin, có trường bị lỗi!");
      return; // Dừng lại
    }

    const data = new FormData();
    const productData = {
      name: formData.name,
      type: formData.type,
      size: formData.size,
      color: formData.color,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
    };
    data.append(
      "product",
      new Blob([JSON.stringify(productData)], { type: "application/json" })
    );

    if (file) {
      data.append("file", file);
    }

    try {
      let actionText = "";
      if (editingProduct) {
        // --- PUT (Sửa) ---
        await api.put(`/products/${editingProduct.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        actionText = "Cập nhật";
      } else {
        // --- POST (Thêm mới) ---
        await api.post("/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        actionText = "Thêm mới";
      }

      fetchProducts();
      setShowModal(false);

      // 4. Thêm toast thành công
      toast.success(`${actionText} sản phẩm thành công!`);
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);

      // 5. Thêm toast lỗi (hiển thị lỗi từ backend nếu có)
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        `Không thể ${editingProduct ? "cập nhật" : "thêm mới"} sản phẩm.`;
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
        // 6. Thêm toast xóa thành công
        toast.success("Xóa sản phẩm thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        // 7. Thêm toast xóa thất bại
        const errorMessage =
          error.response?.data?.message || "Không thể xóa sản phẩm.";
        toast.error(errorMessage);
      }
    }
  };

  // ... (handleChange, handleFileChange, validate, handleAddNew, handleEdit giữ nguyên) ...
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Tên không được để trống";
    if (formData.price === "" || Number(formData.price) < 0)
      newErrors.price = "Giá phải ≥ 0";
    if (formData.stockQuantity === "" || Number(formData.stockQuantity) < 0)
      newErrors.stockQuantity = "Số lượng phải ≥ 0";
    if (!editingProduct && !file) newErrors.file = "Ảnh sản phẩm là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNew = () => {
    setEditingProduct(null);
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
    setFormData({
      imageUrl: p.imageUrl,
      name: p.name,
      type: p.type,
      size: p.size,
      color: p.color,
      price: p.price,
      stockQuantity: p.stockQuantity,
    });
    setFile(null);
    setErrors({});
    setShowModal(true);
  };

  // <-- 6. THÊM BIỂU THỨC ĐIỀU KIỆN (TERNARY) ĐỂ HIỂN THỊ LOADING -->
  return loading ? (
    <Loading />
  ) : (
    <div className="p-5">
      <h2 className="text-2xl font-bold text-center mt-2 mb-4">
        Danh sách sản phẩm
      </h2>

      <SearchBarProduct
        search={search}
        setSearch={setSearch}
        onAdd={handleAddNew}
        
        // --- THÊM 3 DÒNG NÀY ---
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
        onBlur={handleSearchBlur}
        // --- KẾT THÚC ---
      />
      <ProductToolbar
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      <ProductTable
        products={products}
        // 6. XÓA CÁC PROP LIÊN QUAN ĐẾN SORT
        // handleSort={handleSort}
        // sortField={sortField}
        // sortOrder={sortOrder}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* 7. XÓA COMPONENT PAGINATION CŨ */}
      {/*
      <PaginationProduct
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      */}

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
        // 8. Truyền tên file xuống
        fileName={file ? file.name : null}
        
      />
    </div>
  );
}