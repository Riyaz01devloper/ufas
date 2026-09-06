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
import Journals from "./pages/Accountant/journals.jsx";
import Dashboard from "./pages/Accountant/dashboard.jsx";
import Sales from "./pages/Accountant/sales.jsx";
import Purchases from "./pages/Accountant/purchases.jsx";

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
    path: "/dashboard",
    element: <Dashboard />,
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
    path: "/createProduct",
    element: <CreateProduct />,
  },
  {
    path: "/add-chart-of-account",
    element: <AddCoa />,
  },
  {
    path: "/journals",
    element: <Journals />,
  },
  {
    path: "/sales",
    element: <Sales />,
  },
  {
    path: "/purchases",
    element: <Purchases />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
];

export default routes;
