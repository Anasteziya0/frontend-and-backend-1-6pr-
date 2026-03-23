import React from "react";
import ProductCard from "./ProductCard";

export default function ProductsList({ products, onEdit, onDelete }) {
  if (!products.length) {
    return <div className="empty">Товары не найдены</div>;
  }

  return (
    <div className="list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}