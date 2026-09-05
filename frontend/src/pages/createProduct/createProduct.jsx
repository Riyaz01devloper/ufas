import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./createProduct.module.css";
import { useNavigate } from "react-router";
import createProduct from "../../api/createProduct.js";

function CreateProduct() {
  const { accessToken, refreshAccessToken } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    type: "GOODS",
    category: "OTHER",
    purchasingPrice: "",
    sellingPrice: "",
    availableQuantity: "",
    maxMargin: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "purchasingPrice" ||
      name === "sellingPrice" ||
      name === "maxMargin"
    ) {
      // Allow only numbers and a single decimal point
      const regex = /^\d*\.?\d*$/;
      if (!regex.test(value)) {
        return; // Ignore invalid input
      }
    }
    if (name === "availableQuantity") {
      // Allow only whole numbers
      const regex = /^\d*$/;
      if (!regex.test(value)) {
        return; // Ignore invalid input
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const moveBack = () => {
    setFormData({
      name: "",
      brandName: "",
      type: "",
      category: "",
      purchasingPrice: "",
      sellingPrice: "",
      availableQuantity: "",
      maxMargin: "",
    });
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ProductData = {
      name: formData.name,
      brandName: formData.brandName,
      type: formData.type,
      category: formData.category,
      purchasingPrice: formData.purchasingPrice,
      sellingPrice: formData.sellingPrice,
      availableQuantity: formData.availableQuantity,
      maxMargin: formData.maxMargin,
    };
    console.log("Submitting product data:", ProductData);
    try {
      let response = await createProduct(ProductData, accessToken);
      if (response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        response = await createProduct(ProductData, newAccessToken);
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create product");
      }
      navigate("/"); // Navigate to the home page or any other page after successful submission
    } catch (error) {
      console.error("Error creating product:", error.message);
    }
  };

  return (
    <div className={styles.createProduct}>
      <h1>Create Product Form</h1>

      <div className={styles.formContainer}>
        <form
          id="contact-form"
          className={styles.contactForm}
          onSubmit={handleSubmit}
        >
          {/* Name */}
          <div className={styles.formField}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Brand Name */}
          <div className={styles.formField}>
            <label>Brand Name</label>
            <input
              type="text"
              name="brandName"
              placeholder="Enter brand name"
              value={formData.brandName}
              onChange={handleChange}
            />
          </div>

          {/* Type */}
          <div className={styles.formField}>
            <label>type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="GOODS">Goods</option>
              <option value="SERVICE">Service</option>
              <option value="COMBO">Combo</option>
            </select>
          </div>

          {/* Category */}
          <div className={styles.formField}>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="CHAIRS">Chairs</option>
              <option value="TABLES">Tables</option>
              <option value="SOFAS">Sofas</option>
              <option value="BEDS">Beds</option>
              <option value="WARDROBES">Wardrobes</option>
              <option value="CABINETS">Cabinets</option>
              <option value="DESKS">Desks</option>
              <option value="DINING">Dining</option>
              <option value="OFFICE_FURNITURE">Office Furniture</option>
              <option value="OUTDOOR_FURNITURE">Outdoor Furniture</option>
              <option value="STORAGE">Storage</option>
              <option value="MATTRESSES">Mattresses</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Purchasing Price */}
          <div className={styles.formField}>
            <label>Purchasing Price</label>
            <input
              type="float"
              name="purchasingPrice"
              placeholder="Enter purchasing price"
              value={formData.purchasingPrice}
              onChange={handleChange}
            />
          </div>

          {/* Selling Price */}
          <div className={styles.formField}>
            <label>Selling Price</label>
            <input
              type="float"
              name="sellingPrice"
              placeholder="Enter selling price"
              value={formData.sellingPrice}
              onChange={handleChange}
            />
          </div>

          {/* Available Quantity */}
          <div className={styles.formField}>
            <label>Available Quantity</label>
            <input
              type="number"
              name="availableQuantity"
              placeholder="Enter available quantity"
              value={formData.availableQuantity}
              onChange={handleChange}
            />
          </div>

          {/* Max Margin */}
          <div className={styles.formField}>
            <label>Max Margin</label>
            <input
              type="float"
              name="maxMargin"
              placeholder="Enter max margin"
              value={formData.maxMargin}
              onChange={handleChange}
            />
          </div>
        </form>

        <div className={styles.header}>
          <div className={styles.headerButtons}>
            <button
              type="button"
              className={`${styles.button} ${styles.newButton}`}
              onClick={moveBack}
            >
              Back
            </button>

            <button
              type="submit"
              form="contact-form"
              className={`${styles.button} ${styles.confirmButton}`}
            >
              Create Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
