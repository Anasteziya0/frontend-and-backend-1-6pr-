import React from "react";
import "./ProductsPage.scss";
import ProductsList from "../components/ProductsList";
import ProductModal from "../components/ProductModal";
import Filters from "../components/Filters";

export default function ProductsPage({
  products,
  categories,
  loading,
  filters,
  modalOpen,
  modalMode,
  editingProduct,
  onFilterChange,
  onOpenCreate,
  onOpenEdit,
  onCloseModal,
  onDelete,
  onSubmitModal
}) {
  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <div className="brand">Художественный магазин</div>
          <div className="header__right">Админ-панель</div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="toolbar">
            <h1 className="title">Каталог товаров</h1>
            <button className="btn btn--primary" onClick={onOpenCreate}>
              + Добавить товар
            </button>
          </div>

          <Filters 
            categories={categories}
            filters={filters}
            onFilterChange={onFilterChange}
          />

          {loading ? (
            <div className="empty">Загрузка...</div>
          ) : (
            <ProductsList
              products={products}
              onEdit={onOpenEdit}
              onDelete={onDelete}
            />
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          © {new Date().getFullYear()} Electronics Store. Все права защищены.
        </div>
      </footer>

      <ProductModal
        open={modalOpen}
        mode={modalMode}
        initialProduct={editingProduct}
        onClose={onCloseModal}
        onSubmit={onSubmitModal}
        categories={categories}
      />
    </div>
  );
}