import { NavLink } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./header.module.css";

function Header() {
  const { user } = useAuth();

  const adminMenu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Products", path: "/products" },
    { name: "Sales", path: "/sales" },
    { name: "Purchases", path: "/purchases" },
    { name: "Accounting", path: "/account" },
    { name: "Reports", path: "/reports" },
  ];

  const accountantMenu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Sales", path: "/sales" },
    { name: "Purchases", path: "/purchases" },
    { name: "Invoices", path: "/invoices" },
    { name: "Payments", path: "/payments" },
    { name: "Accounting", path: "/account" },
    { name: "Reports", path: "/reports" },
  ];

  const contactMenu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Invoices", path: "/my-invoices" },
    { name: "My Payments", path: "/my-payments" },
  ];

  let menu = [];

  if (user?.role === "ADMIN") {
    menu = adminMenu;
  } else if (user?.role === "ACCOUNTANT") {
    menu = accountantMenu;
  } else if (user?.role === "CONTACT") {
    menu = contactMenu;
  }

  return (
    <header className={styles.header}>

      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>UF</div>

        <div className={styles.logoText}>
          <h2>Urban Furniture</h2>
          <span>Accounting System</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.navbar}>
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? `${styles.navItem} ${styles.active}`
                : styles.navItem
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className={styles.userSection}>
        <div className={styles.userIcon}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div className={styles.userInfo}>
          <span className={styles.userName}>
            {user?.name}
          </span>

          <span className={styles.userRole}>
            {user?.role}
          </span>
        </div>
      </div>

    </header>
  );
}

export default Header;