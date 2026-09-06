import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import configuration from "../../utils/configuration.js";
import createPurchase from "../../api/createPurchase.js";
import styles from "./purchase.module.css";

function Purchase() {
  const {
    user,
    accessToken,
    refreshAccessToken,
    loading: authLoading,
  } = useAuth();

  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [formData, setFormData] = useState({
    vendorId: "",
    productId: "",
    accountId: "",
    quantity: "",
    unitPrice: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        let token = accessToken;

        const request = async (url) => {
          let response = await fetch(
            `${configuration.API_URL}${url}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
            },
          );

          if (response.status === 401) {
            token = await refreshAccessToken();

            response = await fetch(
              `${configuration.API_URL}${url}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                credentials: "include",
              },
            );
          }

          return response;
        };

        const [productsResponse, accountsResponse, contactsResponse] =
          await Promise.all([
            request("/api/masterdata/all-products"),
            request("/api/masterdata/chart-of-accounts"),
            request("/api/masterdata/contacts"),
          ]);

        const productsData = await productsResponse.json();
        const accountsData = await accountsResponse.json();
        const contactsData = await contactsResponse.json();

        if (!productsResponse.ok) {
          throw new Error(
            productsData.message || "Failed to load products",
          );
        }

        if (!accountsResponse.ok) {
          throw new Error(
            accountsData.message || "Failed to load accounts",
          );
        }

        if (!contactsResponse.ok) {
          throw new Error(
            contactsData.message || "Failed to load vendors",
          );
        }

        setProducts(productsData);
        setAccounts(accountsData);

        setVendors(
          contactsData.filter(
            (contact) =>
              contact.type === "VENDOR" ||
              contact.type === "BOTH",
          ),
        );
      } catch (err) {
        console.error("Error loading purchase form:", err);
        setError(
          err.message || "Failed to load purchase form data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    authLoading,
    user,
    accessToken,
    refreshAccessToken,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const selectedProduct = products.find(
    (product) =>
      String(product.id) === String(formData.productId),
  );

  const totalAmount =
    Number(formData.quantity || 0) *
    Number(formData.unitPrice || 0);

  const handleProductChange = (e) => {
    const productId = e.target.value;

    const product = products.find(
      (item) => String(item.id) === String(productId),
    );

    setFormData((previous) => ({
      ...previous,
      productId,
      unitPrice: product
        ? String(product.purchasingPrice)
        : "",
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.vendorId ||
      !formData.productId ||
      !formData.accountId ||
      !formData.quantity ||
      !formData.unitPrice
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (Number(formData.quantity) <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    if (Number(formData.unitPrice) < 0) {
      setError("Unit price cannot be negative.");
      return;
    }

    setSubmitting(true);

    const purchaseData = {
      vendorId: Number(formData.vendorId),
      productId: Number(formData.productId),
      accountId: Number(formData.accountId),
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
    };

    try {
      let token = accessToken;

      let response = await createPurchase(
        purchaseData,
        token,
      );

      if (response.status === 401) {
        token = await refreshAccessToken();

        response = await createPurchase(
          purchaseData,
          token,
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create purchase",
        );
      }

      setSuccess("Purchase created successfully.");

      setFormData({
        vendorId: "",
        productId: "",
        accountId: "",
        quantity: "",
        unitPrice: "",
      });
    } catch (err) {
      console.error("Error creating purchase:", err);

      setError(
        err.message || "Failed to create purchase",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className={styles.message}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAuthorized =
    user.role === "ADMIN" ||
    user.role === "ACCOUNTANT";

  if (!isAuthorized) {
    return (
      <div className={styles.accessDenied}>
        <h1>Access Denied</h1>
        <p>
          You are not authorized to create purchases.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.message}>
        Loading purchase form...
      </div>
    );
  }

  return (
    <div className={styles.purchasePage}>
      <div className={styles.header}>
        <div>
          <h1>Create Purchase</h1>
          <p>
            Enter the details of a new purchase transaction.
          </p>
        </div>

        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate("/purchases")}
        >
          Back to Purchases
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.success}>
          {success}
        </div>
      )}

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <div className={styles.formGrid}>
          {/* Vendor */}
          <div className={styles.formField}>
            <label htmlFor="vendorId">
              Vendor <span>*</span>
            </label>

            <select
              id="vendorId"
              name="vendorId"
              value={formData.vendorId}
              onChange={handleChange}
              required
            >
              <option value="">
                Select vendor
              </option>

              {vendors.map((vendor) => (
                <option
                  key={vendor.id}
                  value={vendor.id}
                >
                  {vendor.user?.name ||
                    `Vendor #${vendor.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Product */}
          <div className={styles.formField}>
            <label htmlFor="productId">
              Product <span>*</span>
            </label>

            <select
              id="productId"
              name="productId"
              value={formData.productId}
              onChange={handleProductChange}
              required
            >
              <option value="">
                Select product
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account */}
          <div className={styles.formField}>
            <label htmlFor="accountId">
              Account <span>*</span>
            </label>

            <select
              id="accountId"
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              required
            >
              <option value="">
                Select account
              </option>

              {accounts.map((account) => (
                <option
                  key={account.id}
                  value={account.id}
                >
                  {account.accountName}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className={styles.formField}>
            <label htmlFor="quantity">
              Quantity <span>*</span>
            </label>

            <input
              id="quantity"
              type="number"
              name="quantity"
              min="1"
              step="1"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          {/* Unit Price */}
          <div className={styles.formField}>
            <label htmlFor="unitPrice">
              Unit Price <span>*</span>
            </label>

            <input
              id="unitPrice"
              type="number"
              name="unitPrice"
              min="0"
              step="0.01"
              placeholder="Enter unit price"
              value={formData.unitPrice}
              onChange={handleChange}
              required
            />
          </div>

          {/* Product purchase price hint */}
          {selectedProduct && (
            <div className={styles.priceHint}>
              Current product purchasing price: ₹
              {Number(
                selectedProduct.purchasingPrice,
              ).toLocaleString("en-IN")}
            </div>
          )}
        </div>

        {/* Total */}
        <div className={styles.totalBox}>
          <span>Total Amount</span>

          <strong>
            ₹
            {totalAmount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate("/purchases")}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting
              ? "Creating..."
              : "Create Purchase"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Purchase;