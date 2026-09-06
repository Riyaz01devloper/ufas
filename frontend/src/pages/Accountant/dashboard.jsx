import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Navigate } from "react-router";
import configuration from "../../utils/configuration.js";
import styles from "./dashboard.module.css";

function Dashboard() {
  const {
    user,
    accessToken,
    refreshAccessToken,
    loading: authLoading,
  } = useAuth();

  const [stats, setStats] = useState({
    customers: 0,
    vendors: 0,
    products: 0,
    accounts: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchDashboardStats = async () => {
      setLoading(true);
      setError("");

      try {
        let token = accessToken;

        let response = await fetch(
          `${configuration.API_URL}/api/masterdata/dashboard-stats`,
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
            `${configuration.API_URL}/api/masterdata/dashboard-stats`,
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
            data.message || "Failed to fetch dashboard statistics",
          );
        }

        setStats(data);
      } catch (err) {
        setError(err.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
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
        <p>You are not authorized to view the dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <h1>Dashboard</h1>
        <p className={styles.message}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1>Dashboard</h1>
          <p>Urban Furniture Accounting System</p>
        </div>

        <div className={styles.welcome}>
          Welcome, <strong>{user.name}</strong>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.cardTitle}>Customers</div>
          <div className={styles.cardValue}>{stats.customers}</div>
          <div className={styles.cardDescription}>
            Total customers
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.cardTitle}>Vendors</div>
          <div className={styles.cardValue}>{stats.vendors}</div>
          <div className={styles.cardDescription}>
            Total vendors
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.cardTitle}>Products</div>
          <div className={styles.cardValue}>{stats.products}</div>
          <div className={styles.cardDescription}>
            Products in master
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.cardTitle}>Accounts</div>
          <div className={styles.cardValue}>{stats.accounts}</div>
          <div className={styles.cardDescription}>
            Chart of accounts
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;