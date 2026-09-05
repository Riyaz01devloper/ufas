import App from "./App";
import ErrorPage from "./components/ErrorPage";
import LoginPage from "./pages/login/login.jsx";
import RegisterPage from "./pages/register/register.jsx";
import ContactForm from "./pages/contactForm/contactForm.jsx";
import CreateProduct from "./pages/createProduct/createProduct.jsx";
import Products from "./pages/products/products.jsx";
import EditProduct from "./pages/editProduct/editProduct.jsx";
import Account from "./pages/Accountant/account.jsx";
import AddCoa from "./pages/add-coa/addCoa.jsx";

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
    path: "/ContactForm",
    element: <ContactForm />,
  },
  {
    path: "/createProduct",
    element: <CreateProduct />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/updateProduct/:productId",
    element: <EditProduct />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/updateProduct/:productId",
    element: <CreateProduct />,
  },
  {
    path: "/add-chart-of-account",
    element: <AddCoa />,
  },
];

export default routes;
