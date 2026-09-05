import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import configuration from "../../utils/configuration.js";
import styles from "./editProduct.module.css";

/*
Product attributes:
  id        Int               @id @default(autoincrement())
  name      String
  brandName String?
  type      ProductType       @default(GOODS)
  category  FurnitureCategory

  purchasingPrice   Float
  sellingPrice      Float
  availableQuantity Int

  maxMargin Float
*/

const editableFields = [
  "purchasingPrice",
  "sellingPrice",
  "availableQuantity",
  "maxMargin",
];

const fieldLabels = {
  purchasingPrice: "Purchasing Price",
  sellingPrice: "Selling Price",
  availableQuantity: "Available Quantity",
  maxMargin: "Max Margin",
};

function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { accessToken, refreshAccessToken } = useAuth();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const request = async (url, options = {}, token = accessToken) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (response.status === 401 && refreshAccessToken) {
      const newToken = await refreshAccessToken();
      return fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
        },
      });
    }

    return response;
  };

  useEffect(() => {
    let ignore = false;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await request(
          `${configuration.API_URL}/api/masterdata/get-products/${productId}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch product");
        }

        if (!ignore) {
          setProduct(data);
          setFormData(
            editableFields.reduce(
              (values, field) => ({ ...values, [field]: data[field] ?? "" }),
              {},
            ),
          );
        }
      } catch (fetchError) {
        if (!ignore) {
          setError(fetchError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      ignore = true;
    };
  }, [productId, accessToken]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentValues) => ({ ...currentValues, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const payload = {
      purchasingPrice: Number(formData.purchasingPrice),
      sellingPrice: Number(formData.sellingPrice),
      availableQuantity: Number(formData.availableQuantity),
      maxMargin: Number(formData.maxMargin),
    };

    if (
      !Number.isFinite(payload.purchasingPrice) ||
      !Number.isFinite(payload.sellingPrice) ||
      !Number.isInteger(payload.availableQuantity) ||
      !Number.isFinite(payload.maxMargin) ||
      payload.purchasingPrice < 0 ||
      payload.sellingPrice < 0 ||
      payload.availableQuantity < 0 ||
      payload.maxMargin < 0
    ) {
      setError("Enter valid non-negative values. Quantity must be a whole number.");
      return;
    }

    setSaving(true);

    try {
      const response = await request(
        `${configuration.API_URL}/api/masterdata/update-product/${productId}`,
        { method: "PATCH", body: JSON.stringify(payload) },
      );
      const updatedProduct = await response.json();

      if (!response.ok) {
        throw new Error(updatedProduct.message || "Failed to update product");
      }

      setProduct(updatedProduct);
      setFormData(
        editableFields.reduce(
          (values, field) => ({ ...values, [field]: updatedProduct[field] ?? "" }),
          {},
        ),
      );
      navigate("/products");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main className={styles.editProductPage}>Loading product...</main>;
  }

  if (!product) {
    return (
      <main className={styles.editProductPage}>
        <p className={styles.error}>{error || "Product not found"}</p>
        <button type="button" onClick={() => navigate(-1)}>Back</button>
      </main>
    );
  }

  return (
    <main className={styles.editProductPage}>
      <h1>Edit Product</h1>
      {error && <p className={styles.error} role="alert">{error}</p>}

      <form className={styles.editProductForm} onSubmit={handleSubmit}>
        <h2>{product.name}</h2>
        <p>Brand: {product.brandName || "-"}</p>
        <p>Type: {product.type}</p>
        <p>Category: {product.category}</p>

        {editableFields.map((field) => (
          <label className={styles.formField} key={field}>
            {fieldLabels[field]}
            <input
              type={field === "availableQuantity" ? "number" : "number"}
              name={field}
              min="0"
              step={field === "availableQuantity" ? "1" : "any"}
              value={formData[field] ?? ""}
              onChange={handleChange}
              required
            />
          </label>
        ))}

        <div className={styles.actions}>
          <button type="button" onClick={() => navigate(-1)} disabled={saving}>
            Cancel
          </button>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default EditProduct;
