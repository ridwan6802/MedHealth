import { useMemo, useState } from 'react';
import BrandHeader from '../../components/BrandHeader';

export default function MedicinesView({ medicines, categories, loading, error, summary, formData, editingId, showForm, onChange, onSubmit, onEdit, onDelete, onCancel }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const resolveCategoryName = (medicine) => {
    if (medicine.categoryName) {
      return medicine.categoryName;
    }

    const populatedCategoryName = medicine.category?.name || medicine.category?.categoryName || medicine.category?.title;
    if (populatedCategoryName) {
      return populatedCategoryName;
    }

    const rawCategoryValue =
      medicine.category_id ??
      medicine.categoryId ??
      medicine.category?.id ??
      medicine.category?._id ??
      medicine.category?.name ??
      medicine.category ??
      '';
    const normalizedCategoryValue = String(rawCategoryValue).trim().toLowerCase();
    const matchedCategory = categories.find((category) => {
      const categoryId = String(category._id || category.id || '').trim().toLowerCase();
      const categoryName = String(category.name || category.categoryName || category.title || '').trim().toLowerCase();
      return categoryId === normalizedCategoryValue || categoryName === normalizedCategoryValue;
    });
    if (matchedCategory?.name || matchedCategory?.categoryName || matchedCategory?.title) {
      return matchedCategory.name || matchedCategory.categoryName || matchedCategory.title;
    }

    return 'Unassigned';
  };

  const filteredMedicines = useMemo(() => {
    let filtered = medicines;

    if (searchTerm) {
      const normalizedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((medicine) =>
        String(medicine.name || '').toLowerCase().includes(normalizedSearch) ||
        resolveCategoryName(medicine).toLowerCase().includes(normalizedSearch)
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((medicine) => resolveCategoryName(medicine).toLowerCase() === categoryFilter.toLowerCase());
    }

    if (priceFilter === 'under-5') {
      filtered = filtered.filter((medicine) => Number(medicine.price || 0) < 5);
    } else if (priceFilter === '5-to-10') {
      filtered = filtered.filter((medicine) => Number(medicine.price || 0) >= 5 && Number(medicine.price || 0) <= 10);
    } else if (priceFilter === 'above-10') {
      filtered = filtered.filter((medicine) => Number(medicine.price || 0) > 10);
    }

    if (stockFilter === 'in-stock') {
      filtered = filtered.filter((medicine) => Number(medicine.stock || 0) >= 10);
    } else if (stockFilter === 'low-stock') {
      filtered = filtered.filter((medicine) => Number(medicine.stock || 0) > 0 && Number(medicine.stock || 0) < 10);
    } else if (stockFilter === 'out-of-stock') {
      filtered = filtered.filter((medicine) => Number(medicine.stock || 0) === 0);
    }

    return filtered;
  }, [medicines, searchTerm, stockFilter, categoryFilter, priceFilter, categories]);

  return (
    <main className="admin-manage-page">
      <BrandHeader />
      <div className="manage-medicines-container">
        <div className="medicine-header">
          <h1>Manage Medicines</h1>
          <button id="toggle-form-btn" type="button" className="btn btn-primary" onClick={onCancel}>+ Add New Medicine</button>
        </div>

        <div className="search-sort-container medicine-toolbar">
          <div className="search-filter-section">
            <div className="search-box medicine-search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="filter-options medicine-filter-options">
            <select className="filter-select" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category._id || category.id || category.name} value={String(category.name || '').toLowerCase()}>
                  {category.name}
                </option>
              ))}
            </select>

            <select className="filter-select" value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}>
              <option value="all">All Prices</option>
              <option value="under-5">Under ৳5</option>
              <option value="5-to-10">৳5 to ৳10</option>
              <option value="above-10">Above ৳10</option>
            </select>

            <select className="filter-select" value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}>
              <option value="all">All Stock</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="medicine-form-container" style={{ display: showForm || editingId ? 'block' : 'none' }}>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="name">Medicine Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={onChange} placeholder="e.g., Paracetamol" required />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input type="text" id="description" name="description" value={formData.description} onChange={onChange} placeholder="e.g., Pain reliever" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={formData.category} onChange={onChange} required>
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="price">Price (৳)</label>
                <input type="number" id="price" name="price" value={formData.price} onChange={onChange} placeholder="e.g., 5.99" step="0.01" required />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock Quantity</label>
                <input type="number" id="stock" name="stock" value={formData.stock} onChange={onChange} placeholder="e.g., 100" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input type="date" id="expiryDate" name="expiryDate" value={formData.expiryDate} onChange={onChange} />
            </div>

            {error ? <p className="form-error">{error}</p> : null}

            <div className="form-actions">
              <button type="submit" className="btn btn-submit">{editingId ? 'Update' : 'Save'}</button>
              <button type="button" className="btn btn-cancel" onClick={onCancel}>Cancel</button>
            </div>
          </form>
        </div>

        {loading ? <p className="dashboard-note">Loading medicines...</p> : null}

        <div className="medicine-list">
          <div className="list-header">
            <span className="med-name">Medicine Name</span>
            <span className="med-category">Category</span>
            <span className="med-price">Price</span>
            <span className="med-stock">Stock</span>
            <span className="med-actions">Actions</span>
          </div>
          <div className="list-body">
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map((medicine) => (
                <div className="medicine-item" key={medicine._id} data-name={String(medicine.name || '').toLowerCase()}>
                  <span className="med-name">{medicine.name}</span>
                  <span className="med-category">{resolveCategoryName(medicine)}</span>
                  <span className="med-price">৳{Number(medicine.price || 0).toFixed(2)}</span>
                  <span className={`med-stock ${Number(medicine.stock || 0) === 0 ? 'out-of-stock' : Number(medicine.stock || 0) < 10 ? 'low-stock' : ''}`}>
                    {medicine.stock}
                  </span>
                  <span className="med-actions">
                    <button type="button" className="btn-edit" onClick={() => onEdit(medicine)}>Edit</button>
                    <button type="button" className="btn-delete" onClick={() => onDelete(medicine._id)}>Delete</button>
                  </span>
                </div>
              ))
            ) : (
              <div className="medicine-empty-state">
                <p>No medicines match your search or filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}