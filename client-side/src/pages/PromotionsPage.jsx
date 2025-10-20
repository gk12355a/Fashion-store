import React, { useState } from "react";
import SearchBar from "../components/Promotion/SearchBar";
import PromotionTable from "../components/Promotion/PromotionTable";
import Pagination from "../components/Promotion/Pagination";
import PromotionForm from "../components/Promotion/PromotionForm";
import { initialPromotions } from "../components/Promotion/promotions";
import "../styles/FeaturePage.css";
export default function PromotionPage() {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({ name: "", type: "", discount: "", expiry: "" });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("asc"); }
  };

  const filteredPromotions = promotions
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.type.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => {
      if(!sortField) return 0;
      if(sortField==="name") return sortOrder==="asc"? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      if(sortField==="discount") return sortOrder==="asc"? a.discount - b.discount : b.discount - a.discount;
      return 0;
    });

  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const paginated = filteredPromotions.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const validate = () => {
    const newErrors = {};
    if(!formData.name.trim()) newErrors.name = "Tên KM không được để trống";
    if(!formData.type.trim()) newErrors.type = "Loại không được để trống";
    if(formData.discount === "" || formData.discount < 0) newErrors.discount = "Giảm giá phải ≥0";
    if(!formData.expiry) newErrors.expiry = "Thời hạn không được để trống";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if(!validate()) return;
    if(editingPromotion) setPromotions(promotions.map(p => p.id===editingPromotion.id ? {...p, ...formData} : p));
    else {
      const newPromotion = {id: promotions.length+1, ...formData, discount: Number(formData.discount)};
      setPromotions([...promotions,newPromotion]);
    }
    setShowModal(false);
    setEditingPromotion(null);
    setFormData({name:"",type:"",discount:"",expiry:""});
  };

  const handleAddNew = () => {
    setEditingPromotion(null);
    setFormData({name:"",type:"",discount:"",expiry:""});
    setShowModal(true);
  };

  const handleEdit = (p) => {
    setEditingPromotion(p);
    setFormData(p);
    setShowModal(true);
  };

  const handleDelete = (id) => window.confirm("Bạn có chắc muốn xóa khuyến mãi này không?") && setPromotions(promotions.filter(p=>p.id!==id));

  return (
    <div className="feature-page">
      <h2>Danh sách khuyến mãi</h2>
      <SearchBar search={search} setSearch={setSearch} onAddNew={handleAddNew}/>
      <PromotionTable promotions={paginated} handleSort={handleSort} sortField={sortField} sortOrder={sortOrder} handleEdit={handleEdit} handleDelete={handleDelete}/>
      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      <PromotionForm show={showModal} formData={formData} errors={errors} onChange={handleChange} onSave={handleSave} onCancel={()=>setShowModal(false)} editing={editingPromotion}/>
    </div>
  );
}
