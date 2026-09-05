import "./App.css";
import Header from "./components/header/header.jsx";
function App() {
  return (
    <div className="app">
      <Header role = "ADMIN"  />
      {/* <Header role="ACCOUNTANT" /> */}
      {/* <Header role="CONTACT" /> */}
      <h1>Urban Furniture Accounting System</h1>

      <p>
        Welcome to Urban Furniture Accounting System
      </p>


      <a href="/products">
        Open Product Master
      </a>
    </div>
  );
}

export default App;