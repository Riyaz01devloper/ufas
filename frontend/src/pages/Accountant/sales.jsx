import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import configuration from "../../utils/configuration.js";
import styles from "./sales.module.css";

function Sales() {
  const {
    user,
    accessToken,
    refreshAccessToken,
    loading: authLoading,
  } = useAuth();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchSales = async () => {
      setLoading(true);
      setError("");

      try {
        let token = accessToken;

        let response = await fetch(
          `${configuration.API_URL}/api/masterdata/sales`,
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
            `${configuration.API_URL}/api/masterdata/sales`,
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
          throw new Error(data.message || "Failed to fetch sales");
        }

        setSales(data);
      } catch (err) {
        console.error("Error fetching sales:", err);
        setError(err.message || "Unable to fetch sales");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
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
        <p>You are not authorized to view sales.</p>
      </div>
    );
  }

  return (
    <div className={styles.salesContainer}>
      <div className={styles.header}>
        <div>
          <h1>Sales</h1>
          <p>View sales transactions</p>
        </div>

        <div className={styles.total}>
          Total Sales: <strong>{sales.length}</strong>
        </div>
      </div>

      {loading && (
        <div className={styles.message}>
          Loading sales...
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
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Tax</th>
                <th>Total Amount</th>
                <th>Account</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {sales.length > 0 ? (
                sales.map((sale, index) => (
                  <tr key={sale.id}>
                    <td>{index + 1}</td>

                    <td>
                      {sale.customer?.user?.name || "Unknown"}
                    </td>

                    <td>
                      {sale.product?.name || "Unknown"}
                    </td>

                    <td>{sale.quantity}</td>

                    <td>
                      ₹{Number(sale.unitPrice).toLocaleString("en-IN")}
                    </td>

                    <td>
                      ₹{Number(sale.tax).toLocaleString("en-IN")}
                    </td>

                    <td className={styles.amount}>
                      ₹
                      {Number(sale.totalAmount).toLocaleString(
                        "en-IN",
                      )}
                    </td>

                    <td>
                      {sale.account?.accountName || "Unknown"}
                    </td>

                    <td>
                      {new Date(
                        sale.createdAt,
                      ).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className={styles.empty}>
                    No sales found.
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

export default Sales;