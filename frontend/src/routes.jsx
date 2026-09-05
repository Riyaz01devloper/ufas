import App from "./App";
import ErrorPage from "./components/ErrorPage";
import LoginPage from "./pages/login/login.jsx";
import RegisterPage from "./pages/register/register.jsx";
import VendorForm from "./pages/vendorForm/vendorForm.jsx";
import ProductMaster from "./pages/viewForm/productMaster";

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
  // {
  //   path: "/ContactForm",
  //   element: <ContactForm />,
  // },
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/vendorform",
    element: <VendorForm />,
  },
  {
    path: "/products",
    element: <ProductMaster />,
  },
];

export default routes;
