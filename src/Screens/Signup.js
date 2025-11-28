import React, { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import "../../src/App.css";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    Age: "",
    OTP: "",
  });

  // UI state
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAgeConfirmationOpen, setIsAgeConfirmationOpen] = useState(false); // State for parental confirmation
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigateToLogin = () => {
    navigate("/");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (registrationSuccess) {
      navigateToLogin();
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (formData.Password !== formData.ConfirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // If age is under 18, ask for parental access
    if (parseInt(formData.Age) < 18) {
      setIsAgeConfirmationOpen(true); // Open age confirmation modal
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        // --- API URL FIXED HERE ---
        `${RENDER_BASE_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name: formData.Name,
            Email: formData.Email,
            Password: formData.Password,
            Age: parseInt(formData.Age),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Open OTP modal if registration was successful
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/users/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name: formData.Name,
            Email: formData.Email,
            Password: formData.Password,
            Age: parseInt(formData.Age),
            OTP: formData.OTP,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      setRegistrationSuccess(true);
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle parental access confirmation
  const handleParentalAccessConfirmation = (confirm) => {
    if (confirm) {
      // Proceed with signup if parental access is confirmed
      handleSignupWithoutEvent(); // Call a new function that handles signup without needing an event
    } else {
      setError("You need parental access to register under 18.");
      setIsAgeConfirmationOpen(false); // Close modal if denied
    }
  };

  // New function for handling signup without event
  const handleSignupWithoutEvent = async () => {
    setError("");
    setLoading(true);

    // Validation
    if (formData.Password !== formData.ConfirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name: formData.Name,
            Email: formData.Email,
            Password: formData.Password,
            Age: parseInt(formData.Age),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Open OTP modal if registration was successful
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="signup-container">
        {/* Left side content */}
        <div className="left-content">
          <h1 className="welcome-text">Roll the carpet.!</h1>
          <h3 className="skip-button">Ready to Register ?</h3>
        </div>

        {/* Right side login card */}
        <div className="login-card">
          <div className="card-header">
            <h2 className="login-title">Signup</h2>
            <p className="login-subtitle">Just some details to get you in!</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="login-form" onSubmit={handleSignup}>
            <div>
              <input
                type="text"
                name="Name"
                placeholder="Full Name"
                className="input-field"
                value={formData.Name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="Email"
                placeholder="Email"
                className="input-field"
                value={formData.Email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="Age"
                placeholder="Age"
                className="input-field"
                value={formData.Age}
                onChange={handleChange}
                required
                min="1"
              />
            </div>

            {/* Password field */}
            <div className="password-field">
              <input
                type={passwordVisible ? "text" : "password"}
                name="Password"
                placeholder="Password"
                className="input-field"
                value={formData.Password}
                onChange={handleChange}
                required
              />
              {passwordVisible ? (
                <Eye
                  className="eye-icon"
                  size={20}
                  onClick={() => setPasswordVisible(false)}
                />
              ) : (
                <EyeOff
                  className="eye-icon"
                  size={20}
                  onClick={() => setPasswordVisible(true)}
                />
              )}
            </div>

            {/* Confirm Password field */}
            <div className="password-field">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                name="ConfirmPassword"
                placeholder="Confirm Password"
                className="input-field"
                value={formData.ConfirmPassword}
                onChange={handleChange}
                required
              />
              {confirmPasswordVisible ? (
                <Eye
                  className="eye-icon"
                  size={20}
                  onClick={() => setConfirmPasswordVisible(false)}
                />
              ) : (
                <EyeOff
                  className="eye-icon"
                  size={20}
                  onClick={() => setConfirmPasswordVisible(true)}
                />
              )}
            </div>

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? "Processing..." : "Signup"}
            </button>
          </form>

          <div className="extra-links">
            <div className="separator">
              <span className="separator-line"></span>
              <span className="separator-text">or</span>
              <span className="separator-line"></span>
            </div>
          </div>

          <div className="signup-section">
            <p>
              Already Registered?{" "}
              <a
                href="#"
                className="Login-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToLogin();
                }}
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Age Confirmation Modal */}
      {isAgeConfirmationOpen && (
        <div className="otp-modal-overlay">
          <div className="otp-modal-content">
            <h2 className="otp-modal-title">Parental Access Confirmation</h2>
            <p className="otp-modal-subtitle">
              You are under 18. Do you have parental access to use this service?
            </p>
            <button
              className="otp-modal-confirm-button"
              onClick={() => handleParentalAccessConfirmation(true)}
            >
              Yes, I have parental access
            </button>
            <button
              className="otp-modal-close-button"
              onClick={() => handleParentalAccessConfirmation(false)}
            >
              No, I don't
            </button>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {isModalOpen && (
        <div className="otp-modal-overlay">
          <div className="otp-modal-content">
            {registrationSuccess ? (
              <>
                <h2 className="otp-modal-title">
                  Account Created Successfully!
                </h2>
                <p className="otp-modal-subtitle">
                  Your account has been created. You can now login.
                </p>
                <button
                  className="otp-modal-confirm-button"
                  onClick={closeModal}
                >
                  Go to Login
                </button>
              </>
            ) : (
              <>
                <h2 className="otp-modal-title">Confirm Your Identity</h2>
                <p className="otp-modal-subtitle">
                  We have sent the OTP to your email. Please enter it below to
                  confirm your identity.
                </p>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleOTPVerification}>
                  <input
                    type="text"
                    name="OTP"
                    placeholder="Enter OTP"
                    className="otp-modal-input-field"
                    value={formData.OTP}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="submit"
                    className="otp-modal-confirm-button"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Confirm"}
                  </button>
                  <button
                    type="button"
                    className="otp-modal-close-button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SignupPage;
