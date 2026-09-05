import { useState } from "react";
import styles from "./vendorForm.module.css";

function VendorForm({ onBack, onSubmit }) {
  const [formData, setFormData] = useState({
    product: "",
    brandName: "",
    cost: "",
    sellingPrice: "",
    quantity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNew = () => {
    setFormData({
      product: "",
      brandName: "",
      cost: "",
      sellingPrice: "",
      quantity: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.product) {
      alert("Product name is required");
      return;
    }

    if (!formData.brandName) {
      alert("Brand name is required");
      return;
    }

    if (formData.cost === "") {
      alert("Cost is required");
      return;
    }

    if (formData.sellingPrice === "") {
      alert("Selling price is required");
      return;
    }

    if (formData.quantity === "") {
      alert("Quantity is required");
      return;
    }

    const productData = {
      product: formData.product,
      brandName: formData.brandName,
      cost: Number(formData.cost),
      sellingPrice: Number(formData.sellingPrice),
      quantity: Number(formData.quantity),
    };

    console.log("Product:", productData);

    if (onSubmit) {
      onSubmit(productData);
    }
  };

  return (
    <div className={styles.vendorPage}>

      {/* Header */}
      <div className={styles.vendorHeader}>
        <h1>Vendor</h1>

        <div className={styles.headerButtons}>

          <button
            type="button"
            className={`${styles.productBtn} ${styles.newBtn}`}
            onClick={handleNew}
          >
            New
          </button>

          <button
            type="submit"
            form="product-form"
            className={`${styles.productBtn} ${styles.confirmBtn}`}
          >
            Confirm
          </button>

          <button
            type="button"
            className={`${styles.productBtn} ${styles.backBtn}`}
            onClick={onBack}
          >
            Back
          </button>

        </div>
      </div>

      {/* Form */}
      <form
        id="product-form"
        className={styles.productForm}
        onSubmit={handleSubmit}
      >

        {/* Product */}
        <div className={styles.productField}>
          <label>Product</label>

          <input
            type="text"
            name="product"
            placeholder="Enter product name"
            value={formData.product}
            onChange={handleChange}
          />
        </div>

        <div className={styles.productField}>
          <label>Brand Name</label>

          <input
            type="text"
            name="brandName"
            placeholder="Enter brand name"
            value={formData.brandName}
            onChange={handleChange}
          />
        </div>

        <div className={styles.productField}>
          <label>Cost</label>

          <div className={styles.moneyInput}>
            <span>₹</span>

            <input
              type="number"
              name="cost"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.productField}>
          <label>Selling Price</label>

          <div className={styles.moneyInput}>
            <span>₹</span>

            <input
              type="number"
              name="sellingPrice"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={formData.sellingPrice}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Quantity */}
        <div className={styles.productField}>
          <label>Quantity</label>

          <input
            type="number"
            name="quantity"
            placeholder="Enter quantity"
            min="0"
            step="1"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

      </form>
    </div>
  );
}

export default VendorForm;