import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandHeader from '../../components/BrandHeader';

export default function DashboardView({ medicines, categories, loading, error, cartMessage, onAddToCart }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [quantities, setQuantities] = useState({});
  const [showCartBanner, setShowCartBanner] = useState(false);
  const [isCartBannerVisible, setIsCartBannerVisible] = useState(false);
  const [stockWarning, setStockWarning] = useState('');
  const [showStockWarning, setShowStockWarning] = useState(false);
  const [isStockWarningVisible, setIsStockWarningVisible] = useState(false);

  const getCategoryValue = (category) => {
    if (!category) {
      return '';
    }

    if (typeof category === 'string' || typeof category === 'number') {
      return String(category);
    }

    return String(category.id || category._id || category.name || category.category || '');
  };

  const getMedicineCategoryValue = (medicine) => {
    if (!medicine) {
      return '';
    }

    const categoryValue = medicine.category_id ?? medicine.categoryId ?? medicine.category?.id ?? medicine.category?._id ?? medicine.category;
    return String(categoryValue || '');
  };

  const visibleMedicines = useMemo(() => {
    const filtered = medicines.filter((medicine) => {
      const matchesSearch = !searchTerm || [medicine.name, medicine.description].some((value) => String(value || '').toLowerCase().includes(searchTerm.toLowerCase()));
      const selectedCategory = String(categoryFilter);
      const medicineCategory = getMedicineCategoryValue(medicine);
      const matchesCategory = selectedCategory === 'all' || medicineCategory === selectedCategory || String(medicine.category?.name || '').toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((left, right) => {
      const leftName = String(left.name || '').toLowerCase();
      const rightName = String(right.name || '').toLowerCase();
      const leftPrice = Number(left.price || 0);
      const rightPrice = Number(right.price || 0);
      const leftExpiry = left.expiryDate || left.expiry_date || '';
      const rightExpiry = right.expiryDate || right.expiry_date || '';

      switch (sortBy) {
        case 'name-desc':
          return rightName.localeCompare(leftName);
        case 'price-asc':
          return leftPrice - rightPrice;
        case 'price-desc':
          return rightPrice - leftPrice;
        default:
          return leftName.localeCompare(rightName);
      }
    });
  }, [medicines, searchTerm, categoryFilter, sortBy]);

  const flashStockWarning = (message) => {
    setStockWarning(message);
    setShowStockWarning(true);
    setIsStockWarningVisible(false);

    const enterFrame = window.requestAnimationFrame(() => {
      setIsStockWarningVisible(true);
    });

    const fadeTimer = window.setTimeout(() => {
      setIsStockWarningVisible(false);
    }, 2600);

    const hideTimer = window.setTimeout(() => {
      setShowStockWarning(false);
      setStockWarning('');
      setIsStockWarningVisible(false);
    }, 3000);

    return () => {
      window.cancelAnimationFrame(enterFrame);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  };

  const updateQuantity = (medicineId, delta, stock) => {
    setQuantities((current) => {
      const currentValue = current[medicineId] || 1;
      const nextValue = Math.max(1, currentValue + delta);

      if (stock <= 0) {
        flashStockWarning('Item is Out of Stock!');
        return { ...current, [medicineId]: 1 };
      }

      if (nextValue > stock) {
        flashStockWarning(`Only ${stock} item${stock === 1 ? '' : 's'} in stock.`);
        return { ...current, [medicineId]: stock };
      }

      return { ...current, [medicineId]: nextValue };
    });
  };

  const handleAddToCart = (medicineId, quantity, stock) => {
    if (stock <= 0) {
      flashStockWarning('Item is Out of Stock!');
      return;
    }

    if (quantity > stock) {
      flashStockWarning(`Only ${stock} item${stock === 1 ? '' : 's'} in stock.`);
      return;
    }

    onAddToCart?.(medicineId, quantity);
  };

  useEffect(() => {
    if (!cartMessage) {
      setShowCartBanner(false);
      setIsCartBannerVisible(false);
      return undefined;
    }

    setShowCartBanner(true);
    setIsCartBannerVisible(false);

    const enterFrame = window.requestAnimationFrame(() => {
      setIsCartBannerVisible(true);
    });

    const fadeTimer = window.setTimeout(() => {
      setIsCartBannerVisible(false);
    }, 2600);

    const hideTimer = window.setTimeout(() => {
      setShowCartBanner(false);
      setIsCartBannerVisible(false);
    }, 3000);

    return () => {
      window.cancelAnimationFrame(enterFrame);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [cartMessage]);

  return (
    <main className="pharmacy-dashboard">
      <BrandHeader />
      <div className="dashboard-header customer-dashboard-header">
        <h1>Welcome to Our Online Pharmacy</h1>
        <p>Find your medications and health products</p>
      </div>

      <div className="search-sort-container">
        <div className="search-filter-section">
          <div className="search-box">
            <input type="text" id="medicine-search" placeholder="Search medicines..." className="search-input" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            <button className="search-button" type="button" onClick={() => setSearchTerm(searchTerm.trim())}>Search</button>
            <button className="clear-search" type="button" onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }}>Clear</button>
          </div>

          <div className="filter-options">
            <select id="filter-category" className="filter-select" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category._id || category.id || category.name} value={getCategoryValue(category)}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sort-options">
          <select id="sort-by" className="sort-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>

      {showCartBanner ? (
        <div className={`cart-success-banner${isCartBannerVisible ? ' visible' : ''}`} role="status" aria-live="polite">
          {cartMessage}
        </div>
      ) : null}

      {showStockWarning ? (
        <div className={`cart-success-banner stock-warning-banner${isStockWarningVisible ? ' visible' : ''}`} role="status" aria-live="polite">
          {stockWarning}
        </div>
      ) : null}

      {loading ? <p className="dashboard-note">Loading catalog...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      <div className="medicine-grid" id="medicine-container">
        {visibleMedicines.map((medicine) => {
          const medicineId = medicine._id;
          const quantity = quantities[medicineId] || 1;
          const expiryDate = medicine.expiryDate || medicine.expiry_date;
          const categoryId = getMedicineCategoryValue(medicine);

          return (
            <div key={medicineId} className="medicine-card" data-id={medicineId} data-price={medicine.price} data-expiry={expiryDate} data-stock={medicine.stock} data-category={categoryId}>
              <div className="medicine-details">
                <h3>{medicine.name}</h3>
                <p className="description">{medicine.description}</p>
                <div className="price-stock">
                  <span className="price">৳{Number(medicine.price || 0).toFixed(2)}</span>
                  <span className="stock">{medicine.stock} in stock</span>
                </div>
                <div className="expiry-date">{expiryDate ? `Expiry: ${String(expiryDate).slice(0, 10)}` : ''}</div>
              </div>
              <div className="medicine-actions">
                <div className="quantity-control">
                  <button type="button" className="quantity-btn minus" onClick={() => updateQuantity(medicineId, -1, Number(medicine.stock || 0))}>-</button>
                  <input type="number" className="quantity-input" value={quantity} min="1" readOnly />
                  <button type="button" className="quantity-btn plus" onClick={() => updateQuantity(medicineId, 1, Number(medicine.stock || 0))}>+</button>
                </div>
                <button type="button" className="add-to-cart-btn" onClick={() => handleAddToCart(medicineId, quantity, Number(medicine.stock || 0))}>Add to Cart</button>
              </div>
            </div>
          );
        })}
      </div>

      <Link className="floating-cart-btn" to="/customer/cart">See My Cart</Link>
    </main>
  );
}
