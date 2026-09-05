import App from "./App";
import ErrorPage from "./components/ErrorPage";
import LoginPage from "./pages/login/login.jsx";
import RegisterPage from "./pages/register/register.jsx";
import VendorForm from "./pages/vendorForm/venderForm.jsx";

const routes = [
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <App />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/vendor-form",
    element: <VendorForm />,
  },
];

export default routes;
