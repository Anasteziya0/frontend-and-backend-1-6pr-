import React from "react";

export default function ProductCard({ product, onEdit, onDelete }) {
  const getStockStatus = () => {
    if (product.stock === 0) return { class: "out-of-stock", text: "Нет в наличии" };
    if (product.stock < 5) return { class: "low-stock", text: `Осталось ${product.stock} шт` };
    return { class: "in-stock", text: `В наличии: ${product.stock} шт` };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="productCard">
      <img 
        src={product.image} 
        alt={product.name}
        className="productCard__image"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x200?text=Electronics";
        }}
      />
      <div className="productCard__content">
        <div className="productCard__header">
          <h3 className="productCard__name">{product.name}</h3>
          <span className="productCard__category">{product.category}</span>
        </div>
        <p className="productCard__description">{product.description}</p>
        <div className="productCard__details">
          <span className="productCard__price">{product.price.toLocaleString()} ₽</span>
          <span className={`productCard__stock productCard__stock--${stockStatus.class}`}>
            {stockStatus.text}
          </span>
        </div>
        {product.rating > 0 && (
          <div className="productCard__rating">
            <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
            <span className="value">{product.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <div className="productCard__actions">
        <button 
          className="productCard__action-btn productCard__action-btn--edit"
          onClick={() => onEdit(product)}
        >
          ✎ Редактировать
        </button>
        <button 
          className="productCard__action-btn productCard__action-btn--delete"
          onClick={() => onDelete(product.id)}
        >
          × Удалить
        </button>
      </div>
    </div>
  );
}