import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router";
import getChartOfAccount from "../../api/getChartofAccount";
import { useEffect, useState } from "react";
import styles from "./account.module.css";

function Account() {
  const { user, accessToken, refreshAccessToken, loading } = useAuth();

  if (loading) {
    return <div>Authenticating...</div>;
  }
  const [chartOfAccounts, setChartOfAccounts] = useState([]);
  const [accountLoading, setAccountLoading] = useState(true);
  const [error, setError] = useState(null);
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAuthorized = user.role === "ACCOUNTANT" || user.role === "ADMIN";

  if (!isAuthorized) {
    return (
      <div className={styles.accessDenied}>
        <h1>Access Denied</h1>
        <p>You are not authorized to view this page.</p>

        <p>Logged in as: {user.name}</p>
        <p>Role: {user.role}</p>
      </div>
    );
  }

  useEffect(() => {
    const fetchChartOfAccounts = async () => {
      setAccountLoading(true);
      setError(null);

      try {
        let response = await getChartOfAccount(accessToken);

        if (response.status === 401) {
          const newAccessToken = await refreshAccessToken();
          response = await getChartOfAccount(newAccessToken);
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch chart of accounts");
        }

        setChartOfAccounts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setAccountLoading(false);
      }
    };

    fetchChartOfAccounts();
  }, [user]);

  return (
    <div className={styles.accountContainer}>
      <div className={styles.accountHeader}>
        <h1>Chart of Accounts</h1>
        <p>Manage and view your accounting accounts</p>
      </div>

      {accountLoading && (
        <div className={styles.message}>
          <p>Loading accounts...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      {!accountLoading && !error && (
        <div className={styles.tableWrapper}>
          <table className={styles.accountTable}>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Account Name</th>
                <th>Account Type</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {chartOfAccounts.map((account, index) => (
                <tr key={account.id}>
                  <td>{index + 1}</td>
                  <td className={styles.accountName}>{account.accountName}</td>
                  <td>
                    <span
                      className={`${styles.accountType} ${
                        styles[account.accountType.toLowerCase()]
                      }`}
                    >
                      {account.accountType}
                    </span>
                  </td>
                  <td>
                    <button className={styles.deleteButton}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Account;
