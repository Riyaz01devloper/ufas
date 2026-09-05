import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router";

function Accountant() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAuthorized =
    user.role === "ACCOUNTANT" || user.role === "ADMIN";

  if (!isAuthorized) {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>
          You are not authorized to view this page.
        </p>

        <p>
          Logged in as: {user.name}
        </p>

        <p>
          Role: {user.role}
        </p>
      </div>
    );
  }

  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Role: {user.role}</p>

      <Outlet />
    </div>
  );
}

export default Accountant;