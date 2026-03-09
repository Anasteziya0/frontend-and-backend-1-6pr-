import React, { useEffect, useState } from "react";

export default function ProductModal({ 
  open, 
  mode, 
  initialProduct, 
  onClose, 
  onSubmit,
  categories 
}) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    rating: "",
    image: ""
  });

  useEffect(() => {
    if (!open) return;
    
    setFormData({
      name: initialProduct?.name ?? "",
      category: initialProduct?.category ?? "",
      description: initialProduct?.description ?? "",
      price: initialProduct?.price != null ? String(initialProduct.price) : "",
      stock: initialProduct?.stock != null ? String(initialProduct.stock) : "",
      rating: initialProduct?.rating != null ? String(initialProduct.rating) : "",
      image: initialProduct?.image ?? ""
    });
  }, [open, initialProduct]);

  if (!open) return null;

  const title = mode === "edit" ? "Редактирование товара" : "Добавление товара";

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedCategory = formData.category.trim();
    const trimmedDesc = formData.description.trim();
    const price = Number(formData.price);
    const stock = Number(formData.stock);
    const rating = formData.rating ? Number(formData.rating) : 0;

    if (!trimmedName) {
      alert("Введите название товара");
      return;
    }

    if (!trimmedCategory) {
      alert("Выберите категорию");
      return;
    }

    if (!trimmedDesc) {
      alert("Введите описание товара");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      alert("Введите корректную цену");
      return;
    }

    if (!Number.isFinite(stock) || stock < 0) {
      alert("Введите корректное количество");
      return;
    }

    onSubmit({
      id: initialProduct?.id,
      name: trimmedName,
      category: trimmedCategory,
      description: trimmedDesc,
      price: price,
      stock: stock,
      rating: rating,
      image: formData.image || "https://via.placeholder.com/300x200?text=Product"
    });
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose} aria-label="Закрыть">✕</button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Название товара
            <input
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Например, Ноутбук ASUS"
              autoFocus
              required
            />
          </label>

          <label className="label">
            Категория
            <select
              className="select"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="Другое">Другое</option>
            </select>
          </label>

          <label className="label">
            Описание
            <textarea
              className="textarea"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Описание товара"
              required
            />
          </label>

          <div className="form-row">
            <label className="label">
              Цена (₽)
              <input
                className="input"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="99990"
                min="0"
                required
              />
            </label>

            <label className="label">
              Количество
              <input
                className="input"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                placeholder="10"
                min="0"
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label className="label">
              Рейтинг (0-5)
              <input
                className="input"
                type="number"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: e.target.value})}
                placeholder="4.5"
                min="0"
                max="5"
                step="0.1"
              />
            </label>

            <label className="label">
              URL фото
              <input
                className="input"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </label>
          </div>

          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              {mode === "edit" ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}