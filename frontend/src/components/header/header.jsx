import styles from "./header.module.css";
import { useAuth } from "../../context/AuthContext.jsx";
function Header() {

  const { user } = useAuth();

  const role = user?.role;

  const adminMenu = [
    "Dashboard",
    "Master Data",
    "Products",
    "Sales",
    "Purchases",
    "Accounting",
    "Reports"
  ];

  const accountantMenu = [
    "Dashboard",
    "Sales",
    "Purchases",
    "Invoices",
    "Payments",
    "Accounting",
    "Reports"
  ];

  const contactMenu = [
    "Dashboard",
    "My Invoices",
    "My Payments"
  ];

  let menu = [];

  if (role === "ADMIN") {
    menu = adminMenu;
  } 
  else if (role === "ACCOUNTANT") {
    menu = accountantMenu;
  } 
  else if (role === "CONTACT") {
    menu = contactMenu;
  }

  return (
    <header className={styles.header}>

      <div className={styles.logo}>
        <div className={styles.logoIcon}>UF</div>

        <div className={styles.logoText}>
          <h2>Urban Furniture</h2>
          <span>Accounting System</span>
        </div>
      </div>

      <nav className={styles.navbar}>
        {menu.map((item) => (
          <a
            key={item}
            href={`/${item.toLowerCase().replaceAll(" ", "-")}`}
            className={styles.navItem}
          >
            {item}
          </a>
        ))}
      </nav>

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