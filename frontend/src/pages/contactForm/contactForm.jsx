import { useState } from "react";
import styles from "./contactForm.module.css";

function ContactForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNew = () => {
    setFormData({
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      type: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      alert("Email is required");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Phone is required");
      return;
    }

    if (!formData.type) {
      alert("Type is required");
      return;
    }

    const contactData = {
      email: formData.email,
      phone: formData.phone,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      pincode: formData.pincode,
      type: formData.type,
    };

    console.log("Contact:", contactData);

    if (onSubmit) {
      onSubmit(contactData);
    }
  };

  return (
    <div className={styles.contactPage}>
      <h1>Contact Master Form View</h1>

      <div className={styles.formContainer}>
        <div className={styles.header}>
          <div className={styles.headerButtons}>
            <button
              type="button"
              className={`${styles.button} ${styles.newButton}`}
              onClick={handleNew}
            >
              New
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

        <form
          id="contact-form"
          className={styles.contactForm}
          onSubmit={handleSubmit}
        >
          {/* Email */}
          <div className={styles.formField}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div className={styles.formField}>
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Type */}
          <div className={styles.formField}>
            <label>Type</label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="">Select type</option>
              <option value="CUSTOMER">Customer</option>
              <option value="VENDOR">Vendor</option>
              <option value="BOTH">Customer & Vendor</option>
            </select>
          </div>

          {/* Address */}
          <div className={styles.addressSection}>
            <label>Address</label>

            <input
              type="text"
              name="street"
              placeholder="Street"
              value={formData.street}
              onChange={handleChange}
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
            />

            <div className={styles.bottomFields}>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;