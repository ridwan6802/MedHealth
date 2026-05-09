import { useMemo, useState } from 'react';
import BrandHeader from '../../components/BrandHeader';

export default function CategoriesView({ categories, loading, error, formData, editingId, showForm, onChange, onSubmit, onEdit, onDelete, onCancel }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchTerm) {
      return categories;
    }

    const normalizedSearch = searchTerm.toLowerCase();
    return categories.filter((category) =>
      String(category.name || '').toLowerCase().includes(normalizedSearch) ||
      String(category.description || '').toLowerCase().includes(normalizedSearch)
    );
  }, [categories, searchTerm]);

  return (
    <main className="admin-manage-page">
      <BrandHeader />
      <div className="manage-categories-container">
        <div className="category-header">
          <h1>Manage Categories</h1>
          <button id="toggle-form-btn" type="button" className="btn btn-primary" onClick={onCancel}>+ Add New Category</button>
        </div>

        <div className="search-sort-container category-search-bar">
          <div className="search-filter-section">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="category-form-container" style={{ display: showForm || editingId ? 'block' : 'none' }}>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="name">Category Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={onChange} placeholder="e.g., Painkillers" required />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={onChange} placeholder="e.g., Medicines for pain relief" rows="3" required />
            </div>

            {error ? <p className="form-error">{error}</p> : null}

            <div className="form-actions">
              <button type="submit" className="btn btn-submit">{editingId ? 'Update' : 'Save'}</button>
              <button type="button" className="btn btn-cancel" onClick={onCancel}>Cancel</button>
            </div>
          </form>
        </div>

        {loading ? <p className="dashboard-note">Loading categories...</p> : null}

        <div className="category-list">
          <div className="list-header">
            <span className="cat-name">Category Name</span>
            <span className="cat-description">Description</span>
            <span className="cat-actions">Actions</span>
          </div>
          <div className="list-body">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div className="category-item" key={category._id} data-name={String(category.name || '').toLowerCase()}>
                  <span className="cat-name">{category.name}</span>
                  <span className="cat-description">{category.description}</span>
                  <span className="cat-actions">
                    <button type="button" className="btn-edit" onClick={() => onEdit(category)}>Edit</button>
                    <button type="button" className="btn-delete" onClick={() => onDelete(category._id)}>Delete</button>
                  </span>
                </div>
              ))
            ) : (
              <div className="category-empty-state">
                <p>No categories match your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
