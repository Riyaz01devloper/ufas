import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import configuration from "../../utils/configuration.js";
import styles from "./products.module.css";

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

function Products() {
    const { accessToken, refreshAccessToken } = useAuth();
    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editValues, setEditValues] = useState({});
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
        const fetchProducts = async () => {
            try {
                const response = await request(
                    `${configuration.API_URL}/api/masterdata/all-products`,
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch products");
                }

                setProducts(Array.isArray(data) ? data : data.products || []);
            } catch (fetchError) {
                setError(fetchError.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [accessToken]);

    const handleEdit = (product) => {
        setEditingProductId(product.id);
        setEditValues(
            editableFields.reduce(
                (values, field) => ({ ...values, [field]: product[field] ?? "" }),
                {},
            ),
        );
        setError("");
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditValues((values) => ({ ...values, [name]: value }));
    };

    const handleCancel = () => {
        setEditingProductId(null);
        setEditValues({});
    };

    const handleSave = async (productId) => {
        setSaving(true);
        setError("");

        try {
            const payload = {
                purchasingPrice: Number(editValues.purchasingPrice),
                sellingPrice: Number(editValues.sellingPrice),
                availableQuantity: Number(editValues.availableQuantity),
                maxMargin: Number(editValues.maxMargin),
            };
            const response = await request(
                `${configuration.API_URL}/api/masterdata/update-product/${productId}`,
                { method: "PATCH", body: JSON.stringify(payload) },
            );
            const updatedProduct = await response.json();

            if (!response.ok) {
                throw new Error(updatedProduct.message || "Failed to update product");
            }

            setProducts((currentProducts) =>
                currentProducts.map((product) =>
                    product.id === productId ? updatedProduct : product,
                ),
            );
            handleCancel();
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm("Delete this product?")) {
            return;
        }

        try {
            const response = await request(
                `${configuration.API_URL}/api/masterdata/delete-product/${productId}`,
                { method: "DELETE" },
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to delete product");
            }

            setProducts((currentProducts) =>
                currentProducts.filter((product) => product.id !== productId),
            );
        } catch (deleteError) {
            setError(deleteError.message);
        }
    };

    if (loading) {
        return <main className={styles.productsPage}><p>Loading products...</p></main>;
    }

    return (
        <main className={styles.productsPage}>
            <h1 className={styles.pageTitle}>Products</h1>
            {error && <p className={styles.errorMessage} role="alert">{error}</p>}
            {products.length === 0 ? (
                <p className={styles.emptyMessage}>No products available.</p>
            ) : (
                <ul className={styles.productsList}>
                    {products.map((product) => {
                        const isEditing = editingProductId === product.id;

                        return (
                            <li className={styles.productCard} key={product.id}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <p className={styles.productDetails}>Brand: {product.brandName || "-"}</p>
                                <p className={styles.productDetails}>Type: {product.type}</p>
                                <p className={styles.productDetails}>Category: {product.category}</p>
                                {editableFields.map((field) => (
                                    <label className={styles.editableField} key={field}>
                                        {field}: {isEditing ? (
                                            <input
                                                className={styles.editInput}
                                                type="number"
                                                name={field}
                                                value={editValues[field]}
                                                onChange={handleEditChange}
                                            />
                                        ) : (
                                            product[field]
                                        )}
                                    </label>
                                ))}
                                {isEditing ? (
                                    <>
                                        <button className={styles.actionButton} type="button" onClick={() => handleSave(product.id)} disabled={saving}>
                                            {saving ? "Saving..." : "Save"}
                                        </button>
                                        <button className={styles.actionButton} type="button" onClick={handleCancel} disabled={saving}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button className={styles.actionButton} type="button" onClick={() => handleEdit(product)}>
                                        Edit
                                    </button>
                                )}
                                <button className={styles.actionButton} type="button" onClick={() => handleDelete(product.id)}>
                                    Delete
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </main>
    );
}

export default Products;
