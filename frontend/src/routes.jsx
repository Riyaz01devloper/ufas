import App from "./App";
import ErrorPage from "./components/ErrorPage";
import LoginPage from "./pages/login/login.jsx";
import RegisterPage from "./pages/register/register.jsx";
import ContactForm from "./pages/contactForm/contactForm.jsx";

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
    path: "*",
    element: <ErrorPage />,
  },
];

export default routes;
