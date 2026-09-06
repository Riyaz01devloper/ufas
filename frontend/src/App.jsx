import "./App.css";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "./context/AuthContext.jsx";
import Header from "./components/header/header.jsx";
import configuration from "./utils/configuration.js";

function App() {
  const {
    user,
    accessToken,
    refreshAccessToken,
    loading: authLoading,
  } = useAuth();

  const [hasContact, setHasContact] = useState(false);
  const [contactLoading, setContactLoading] = useState(true);
  const [contactError, setContactError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    const checkContact = async () => {
      setContactLoading(true);
      setContactError(null);

      try {
        let token = accessToken;

        let response = await fetch(
          `${configuration.API_URL}/api/masterdata/my-contact`,
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
            `${configuration.API_URL}/api/masterdata/my-contact`,
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
            data.message || "Failed to check contact details",
          );
        }

        setHasContact(data.exists);
      } catch (error) {
        console.error("Error checking contact:", error);
        setContactError(
          error.message || "Failed to check contact details",
        );
      } finally {
        setContactLoading(false);
      }
    };

    checkContact();
  }, [authLoading, user, accessToken, refreshAccessToken]);

  if (authLoading) {
    return <div className="app">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="app">
        <h1>Urban Furniture Accounting System</h1>

        <p>Please log in to continue.</p>

        <Link to="/login">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="app">
      <Header role={user.role} />

      <h1>Urban Furniture Accounting System</h1>

      <p>
        Welcome, {user.name}
      </p>

      {contactLoading && (
        <p>Checking your profile...</p>
      )}

      {contactError && (
        <p className="errorMessage">
          {contactError}
        </p>
      )}

      {!contactLoading && !contactError && (
        <>
          {hasContact ? (
            <>
              <p>
                Your contact profile is already configured.
              </p>

              <Link to="/products">
                Open Product Master
              </Link>
            </>
          ) : (
            <>
              <p>
                Please create your contact profile before
                continuing.
              </p>

              <Link to="/ContactForm">
                Create Contact
              </Link>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;