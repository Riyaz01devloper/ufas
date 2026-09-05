import { useEffect, useState } from "react";
import { Link } from "react-router";
import getAllProducts from "../../api/allProducts.js";
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

function Products() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const { user, accessToken,refreshAccessToken } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let response = await getAllProducts(accessToken);
                if (response.status === 401) {
                    await refreshAccessToken();
                }
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Error fetching products');
                }
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError(`Failed to fetch products: ${error.message}`);
            }
        };

        fetchProducts();
    }, [refreshAccessToken, accessToken]);

    const handleDelete = async (productId) => {
        try {
            const response = await fetch(`${configuration.API_URL}/api/masterdata/delete-product/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('Error deleting product');
            }
            setProducts((currentProducts) =>
                currentProducts.filter((product) => product.id !== productId),
            );
        } catch (error) {
            console.error('Error deleting product:', error);
            setError(`Failed to delete product: ${error.message}`);
        }
    };

    return (
        <main className={styles.productsPage}>
            <h1 className={styles.pageTitle}>Products</h1>
            {error && <p className={styles.errorMessage} role="alert">{error}</p>}
            {products.length > 0 ? (
                <ul className={styles.productsList}>
                    {products.map((product) => (
                        <li className={styles.productCard} key={product.id}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <p className={styles.productDetails}>Brand: {product.brandName || '-'}</p>
                            <p className={styles.productDetails}>Type: {product.type}</p>
                            <p className={styles.productDetails}>Category: {product.category}</p>
                            <p className={styles.productDetails}>Purchasing Price: ${product.purchasingPrice}</p>
                            <p className={styles.productDetails}>Available Quantity: {product.availableQuantity}</p>
                            <p className={styles.productDetails}>Max Margin: {product.maxMargin}%</p>
                            <p className={styles.productDetails}>Price: ${product.sellingPrice}</p>
                            {user && user.role === 'ADMIN' && (
                                <div>
                                    <Link
                                        className={styles.actionButton}
                                        to={`/updateProduct/${product.id}`}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        className={styles.actionButton}
                                        type="button"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.emptyMessage}>No products available.</p>
            )}
        </main>
    )
}

export default Products;