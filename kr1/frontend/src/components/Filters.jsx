import React from "react";

export default function Filters({ categories, filters, onFilterChange }) {
  const handleChange = (key, value) => {
    onFilterChange(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    onFilterChange({
      category: "",
      minPrice: "",
      maxPrice: "",
      inStock: false
    });
  };

  return (
    <div className="filters">
      <div className="filters__group">
        <label className="filters__label">Категория</label>
        <select
          className="filters__input"
          value={filters.category}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          <option value="">Все категории</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="filters__group">
        <label className="filters__label">Цена от</label>
        <input
          type="number"
          className="filters__input"
          value={filters.minPrice}
          onChange={(e) => handleChange("minPrice", e.target.value)}
          placeholder="0"
          min="0"
        />
      </div>

      <div className="filters__group">
        <label className="filters__label">Цена до</label>
        <input
          type="number"
          className="filters__input"
          value={filters.maxPrice}
          onChange={(e) => handleChange("maxPrice", e.target.value)}
          placeholder="999999"
          min="0"
        />
      </div>

      <div className="filters__group">
        <label className="filters__checkbox">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => handleChange("inStock", e.target.checked)}
          />
          Только в наличии
        </label>
      </div>

      <button className="filters__reset" onClick={resetFilters}>
        Сбросить фильтры
      </button>
    </div>
  );
}