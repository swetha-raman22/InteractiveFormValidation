import React, { useState } from "react";

const InteractiveFormValidation = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  // Password strength evaluator
  const getPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "Weak";
    if (/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) return "Strong";
    if (password.length >= 6) return "Medium";
    return "";
  };

  // Field validation
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "username":
        if (!value) error = "Username is required";
        else if (value.length < 3) error = "Username must be at least 3 characters";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Email format is invalid";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 6) error = "Password must be at least 6 characters";
        break;
      case "confirmPassword":
        if (!value) error = "Please confirm your password";
        else if (value !== formData.password) error = "Passwords do not match";
        break;
      default:
        break;
    }
    return error;
  };

  // Handle input change with live validation
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) validationErrors[field] = error;
    });

    setErrors(validationErrors);
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      setSuccessMessage("🎉 Form submitted successfully!");
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setTouched({});
      setErrors({});
      setPasswordStrength("");
    } else {
      setSuccessMessage("");
    }
  };

  const getInputClass = (name) => {
    if (!touched[name]) return "";
    return errors[name] ? "invalid" : "valid";
  };

  const getStrengthColor = (level) => {
    switch (level) {
      case "Weak":
        return "#e74c3c";
      case "Medium":
        return "#f39c12";
      case "Strong":
        return "#27ae60";
      default:
        return "transparent";
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="form-container">
      <h2>Interactive Registration Form</h2>

      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getInputClass("username")}
          placeholder="Enter username"
        />
        {touched.username && errors.username && (
          <small className="error">{errors.username}</small>
        )}
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getInputClass("email")}
          placeholder="Enter email"
        />
        {touched.email && errors.email && (
          <small className="error">{errors.email}</small>
        )}
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getInputClass("password")}
          placeholder="Enter password"
        />
        {passwordStrength && (
          <small
            className="strength"
            style={{ color: getStrengthColor(passwordStrength) }}
          >
            Strength: {passwordStrength}
          </small>
        )}
        {touched.password && errors.password && (
          <small className="error">{errors.password}</small>
        )}
      </div>

      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getInputClass("confirmPassword")}
          placeholder="Re-enter password"
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <small className="error">{errors.confirmPassword}</small>
        )}
      </div>

      <button type="submit">Register</button>

      {successMessage && <p className="success">{successMessage}</p>}

      <style>{`
        .form-container {
          max-width: 330px;
          padding: 20px;
          margin: 30px auto;
          background: #f9fafc;
          border-radius: 8px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.1);
        }
        label {
          font-weight: 600;
          display: block;
          margin-top: 10px;
        }
        input {
          width: 100%;
          padding: 8px;
          margin-top: 4px;
          border: 2px solid #ccc;
          border-radius: 4px;
          transition: all 0.25s ease;
        }
        .invalid {
          border-color: #e74c3c;
          background-color: #fdecea;
        }
        .valid {
          border-color: #27ae60;
        }
        .error {
          color: #e74c3c;
          font-size: 0.8rem;
        }
        .strength {
          display: block;
          font-size: 0.85rem;
          margin-top: 3px;
        }
        .success {
          color: #27ae60;
          font-weight: 600;
          margin-top: 15px;
          text-align: center;
        }
        button {
          width: 100%;
          margin-top: 15px;
          padding: 10px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }
        button:hover {
          background-color: #2980b9;
        }
        h2 {
          text-align: center;
          margin-bottom: 15px;
        }
      `}</style>
    </form>
  );
};

export default InteractiveFormValidation;
