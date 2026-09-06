import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import configuration from "../../utils/configuration.js";
import styles from "./purchases.module.css";

function Purchases() {
  const {
    user,
    accessToken,
    refreshAccessToken,
    loading: authLoading,
  } = useAuth();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchPurchases = async () => {
      setLoading(true);
      setError("");

      try {
        let token = accessToken;

        let response = await fetch(
          `${configuration.API_URL}/api/masterdata/purchases`,
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
            `${configuration.API_URL}/api/masterdata/purchases`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
            },
          );
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch purchases",
          );
        }

        setPurchases(data);
      } catch (err) {
        console.error("Error fetching purchases:", err);
        setError(err.message || "Unable to fetch purchases");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [authLoading, user, accessToken, refreshAccessToken]);

  if (authLoading) {
    return <div className={styles.message}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAuthorized =
    user.role === "ADMIN" || user.role === "ACCOUNTANT";

  if (!isAuthorized) {
    return (
      <div className={styles.accessDenied}>
        <h1>Access Denied</h1>
        <p>You are not authorized to view purchases.</p>
      </div>
    );
  }

  return (
    <div className={styles.purchasesContainer}>
      <div className={styles.header}>
        <div>
          <h1>Purchases</h1>
          <p>View purchase transactions</p>
        </div>

        <div className={styles.total}>
          Total Purchases: <strong>{purchases.length}</strong>
        </div>
      </div>

      {loading && (
        <div className={styles.message}>
          Loading purchases...
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Vendor</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Amount</th>
                <th>Account</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {purchases.length > 0 ? (
                purchases.map((purchase, index) => (
                  <tr key={purchase.id}>
                    <td>{index + 1}</td>

                    <td>
                      {purchase.vendor?.user?.name || "Unknown"}
                    </td>

                    <td>
                      {purchase.product?.name || "Unknown"}
                    </td>

                    <td>{purchase.quantity}</td>

                    <td>
                      ₹
                      {Number(
                        purchase.unitPrice,
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className={styles.amount}>
                      ₹
                      {Number(
                        purchase.totalAmount,
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      {purchase.account?.accountName || "Unknown"}
                    </td>

                    <td>
                      {new Date(
                        purchase.createdAt,
                      ).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className={styles.empty}>
                    No purchases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Purchases;