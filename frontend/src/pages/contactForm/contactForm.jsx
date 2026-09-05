import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./contactForm.module.css";
import { useNavigate } from "react-router";
import createContact from "../../api/createContact.js";

function ContactForm() {
  const { accessToken,refreshAccessToken } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "",
    mobile: "",
    city: "",
    state: "",
    pincode: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const moveBack = () => {
    setFormData({
      type: "",
      mobile: "",
      city: "",
      state: "",
      pincode: ""
    });
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contactData = {
      mobile: formData.mobile,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      type: formData.type,
    };

    try{
      let response = await createContact(contactData, accessToken);
      if (response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        response = await createContact(contactData, newAccessToken);
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create contact");
      }
    } catch (error) {
      console.error("Error creating contact:", error.message);
    }
  };

  return (
    <div className={styles.contactPage}>
      <h1>Contact Master Form View</h1>

      <div className={styles.formContainer}>
        <form
          id="contact-form"
          className={styles.contactForm}
          onSubmit={handleSubmit}
        >
          {/* Type */}
          <div className={styles.formField}>
            <label>type</label>
            <input
              type="text"
              name="type"
              placeholder="Enter type"
              value={formData.type}
              onChange={handleChange}
            />
          </div>

          {/* Mobile */}
          <div className={styles.formField}>
            <label>Mobile</label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          {/* City */}
          <div className={styles.formField}>
            <label>City</label>
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          {/* State */}
          <div className={styles.formField}>
            <label>State</label>
            <input
              type="text"
              name="state"
              placeholder="Enter state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          {/* Pincode */}
          <div className={styles.formField}>
            <label>Pincode</label>

            <input
              type="text"
              name="pincode"
              placeholder="Enter pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
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
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;