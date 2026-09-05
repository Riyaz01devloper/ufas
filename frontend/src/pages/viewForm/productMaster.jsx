import { useState } from "react";
import styles from "./ProductMaster.module.css";

import ProductListView from "./ProductListView";
import ProductKanbanView from "./ProductKanbanView";
import VendorForm from "../vendorForm/vendorForm";

function ProductMaster() {
  const [view, setView] = useState("list");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([
    {
      id: 1,
      product: "Office Chair",
      brandName: "Nilkamal",
      category: "Chairs",
      cost: 3000,
      sellingPrice: 5000,
      quantity: 20,
    },
    {
      id: 2,
      product: "Dining Table",
      brandName: "Urban",
      category: "Tables",
      cost: 6000,
      sellingPrice: 10000,
      quantity: 10,
    },
    {
      id: 3,
      product: "Sofa",
      brandName: "Wakefit",
      category: "Sofas",
      cost: 12000,
      sellingPrice: 18000,
      quantity: 8,
    },
  ]);

  const filteredProducts = products.filter((product) =>
    `${product.product} ${product.brandName} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleNew = () => {
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
  };

  const handleSubmit = (newProduct) => {
    const product = {
      id: Date.now(),
      ...newProduct,
    };

    setProducts((prev) => [...prev, product]);

    setShowForm(false);
  };

  if (showForm) {
    return (
      <VendorForm
        onBack={handleBack}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <div className={styles.page}>

      {/* HEADER */}

      <div className={styles.header}>

        <button
          className={styles.newButton}
          onClick={handleNew}
        >
          New
        </button>

        <input
          className={styles.search}
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className={styles.viewButtons}>

          <button
            type="button"
            className={
              view === "list"
                ? styles.activeView
                : styles.viewButton
            }
            onClick={() => setView("list")}
            title="List View"
          >
            ☷
          </button>

          <button
            type="button"
            className={
              view === "kanban"
                ? styles.activeView
                : styles.viewButton
            }
            onClick={() => setView("kanban")}
            title="Kanban View"
          >
            ▦
          </button>

        </div>

      </div>

      {/* VIEW */}

      {view === "list" ? (
        <ProductListView
          products={filteredProducts}
        />
      ) : (
        <ProductKanbanView
          products={filteredProducts}
        />
      )}

    </div>
  );
}

export default ProductMaster;