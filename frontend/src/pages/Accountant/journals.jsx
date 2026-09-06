import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import styles from "./journals.module.css";
import configuration from "../../utils/configuration";

function Journals() {
  const {
    user,
    accessToken,
    refreshAccessToken,
    loading: authLoading,
  } = useAuth();

  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchJournals = async () => {
      setLoading(true);
      setError(null);

      try {
        let token = accessToken;

        let response = await fetch(
          `${configuration.API_URL}/api/masterdata/journals`,
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
            `${configuration.API_URL}/api/masterdata/journals`,
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
          throw new Error(data.message || "Failed to fetch journals");
        }

        setJournals(data);
      } catch (err) {
        setError(err.message || "Unable to fetch journals");
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
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
        <p>You are not authorized to view journals.</p>
        <p>Logged in as: {user.name}</p>
        <p>Role: {user.role}</p>
      </div>
    );
  }

  return (
    <div className={styles.journalContainer}>
      <div className={styles.journalHeader}>
        <div>
          <h1>Journals</h1>
          <p>View accounting journals</p>
        </div>
      </div>

      {loading && (
        <div className={styles.message}>
          Loading journals...
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className={styles.tableWrapper}>
          <table className={styles.journalTable}>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Journal Name</th>
                <th>Journal Type</th>
              </tr>
            </thead>

            <tbody>
              {journals.length > 0 ? (
                journals.map((journal, index) => (
                  <tr key={journal.id}>
                    <td>{index + 1}</td>
                    <td className={styles.journalName}>
                      {journal.journalName}
                    </td>
                    <td>
                      <span
                        className={`${styles.journalType} ${
                          styles[journal.journalType.toLowerCase()]
                        }`}
                      >
                        {journal.journalType}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className={styles.emptyMessage}>
                    No journals found.
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

export default Journals;