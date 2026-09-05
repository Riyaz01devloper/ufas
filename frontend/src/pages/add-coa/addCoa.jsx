import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./addCoa.module.css";
import { useNavigate } from "react-router";
import addCoa from "../../api/addCoa.js";

/*
 ASSET
  LIABILITY
  EXPENSE
  INCOME
  CAPITAL
*/

function AddCoa() {
  const { accessToken, refreshAccessToken, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountName: "",
    accountType: "ASSET",
  });
  const [errors, setErrors] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const moveBack = () => {
    setFormData({
      accountName: "",
      accountType: "ASSET",
    });
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accountData = {
      accountName: formData.accountName,
      accountType: formData.accountType,
    };
    console.log("Submitting account data:", accountData);
    try {
      let response = await addCoa(accountData, accessToken);
      if (response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        response = await addCoa(accountData, newAccessToken);
      }
      if (user.role !== "ADMIN" && user.role !== "ACCOUNTANT") {
        throw new Error(
          "You do not have permission to create a chart of accounts",
        );
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create chart of accounts");
      }
      navigate("/account"); // Navigate to the home page or any other page after successful submission
    } catch (error) {
      console.error("Error creating chart of accounts:", error.message);
      setErrors(error.message);
    }
  };

  return (
    <div className={styles.addCoa}>
      <h1>Create Chart of Accounts Form</h1>
      {errors && <p className={styles.error}>{errors}</p>}
      <div className={styles.formContainer}>
        <form
          id="contact-form"
          className={styles.contactForm}
          onSubmit={handleSubmit}
        >
          {/* Account Name */}
          <div className={styles.formField}>
            <label>Account Name</label>
            <input
              type="text"
              name="accountName"
              placeholder="Enter name"
              value={formData.accountName}
              onChange={handleChange}
            />
          </div>

          {/* Account Type */}
          <div className={styles.formField}>
            <label>Account Type</label>
            <select
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
            >
              <option value="ASSET">ASSET</option>
              <option value="LIABILITY">LIABILITY</option>
              <option value="EXPENSE">EXPENSE</option>
              <option value="INCOME">INCOME</option>
              <option value="CAPITAL">CAPITAL</option>
            </select>
          </div>
        </form>

        <div className={styles.header}>
          <div className={styles.headerButtons}>
            <button
              type="button"
              className={`${styles.button} ${styles.newButton}`}
              onClick={moveBack}
            >
              Back
            </button>

            <button
              type="submit"
              form="contact-form"
              className={`${styles.button} ${styles.confirmButton}`}
            >
              Create Chart of Accounts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCoa;
