import React, { useState, useRef, useEffect } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import "../App.css"; // Sahi: Ek folder upar (Screens se src mein) jaao aur App.css ko import kar lo.

// RENDER BACKEND BASE URL CONSTANT - (ADDED)
const RENDER_BASE_URL = "https://my-fyp-backend-1.onrender.com";

const LoginPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
    RememberMe: false,
  }); // UI state

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [otpFieldVisible, setOtpFieldVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOTP, setResetOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State for showing modals (Terms & Conditions and Customer Care)

  const [showTerms, setShowTerms] = useState(false);
  const [showCustomerCare, setShowCustomerCare] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const signupPage = () => {
    navigate("/signup");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // --- API URL FIXED HERE ---
      const response = await fetch(`${RENDER_BASE_URL}/api/users/User-Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: formData.Email,
          Password: formData.Password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      } // Store the token in localStorage for application-wide access

      localStorage.setItem("authToken", data.token); // If remember me is checked, also store the email for convenience

      if (formData.RememberMe) {
        localStorage.setItem("userEmail", formData.Email);
      } else {
        localStorage.removeItem("userEmail");
      } // Store user data in localStorage for easy access

      localStorage.setItem("userData", JSON.stringify(data.user)); // Navigate to dashboard after successful login

      navigate("/Dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }; // Forgot Password modal logic

  const handleSendOTP = async () => {
    if (!resetEmail) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // --- API URL FIXED HERE ---
      const response = await fetch(
        `${RENDER_BASE_URL}/api/users/forget-password-otp-send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Email: resetEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpFieldVisible(true);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetOTP || !newPassword) {
      setError("Please enter both OTP and new password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // --- API URL FIXED HERE ---
      const response = await fetch(
        `${RENDER_BASE_URL}/api/users/forget-otp-verified-savepassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Email: resetEmail,
            OTP: resetOTP,
            NewPassword: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      setIsForgotPasswordOpen(false);
      // NOTE: alert() hata kar error state use kiya gaya hai
      setError(
        "Password reset successful. Please login with your new password."
      );
      setResetEmail("");
      setResetOTP("");
      setNewPassword("");
      setOtpFieldVisible(false);
    } catch (err) {
      setError(err.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsForgotPasswordOpen(false);
    setResetEmail("");
    setResetOTP("");
    setNewPassword("");
    setOtpFieldVisible(false);
    setError("");
  }; // Check if we have a remembered email

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("userEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        Email: rememberedEmail,
        RememberMe: true,
      }));
    }
  }, []);

  return (
    <>
           {" "}
      <div className="login-container">
                {/* Left side content */}       {" "}
        <div className="left-content">
                    <h1 className="welcome-text">Welcome to DEF .!</h1>         {" "}
          <h3 className="skip-button">Dynamic Emotion Experience</h3>       {" "}
        </div>
                {/* Right side login card */}       {" "}
        <div className="login-card">
                   {" "}
          <div className="card-header">
                        <h2 className="login-title">Login</h2>           {" "}
            <p className="login-subtitle">Glad you're back.!</p>         {" "}
          </div>
                    {error && <div className="error-message">{error}</div>}     
             {" "}
          <form className="login-form" onSubmit={handleLogin}>
                       {" "}
            <div>
                           {" "}
              <input
                type="email"
                name="Email"
                placeholder="Email"
                className="input-field"
                value={formData.Email}
                onChange={handleChange}
                required
              />
                         {" "}
            </div>
                       {" "}
            <div className="password-field">
                           {" "}
              <input
                type={passwordVisible ? "text" : "password"}
                name="Password"
                placeholder="Password"
                className="input-field"
                value={formData.Password}
                onChange={handleChange}
                required
              />
                           {" "}
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
                         {" "}
            </div>
                       {" "}
            <div className="remember-section">
                           {" "}
              <input
                type="checkbox"
                id="remember"
                name="RememberMe"
                className="checkbox"
                checked={formData.RememberMe}
                onChange={handleChange}
              />
                            <label htmlFor="remember">Remember me</label>       
                 {" "}
            </div>
                       {" "}
            <button type="submit" className="login-button" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}           {" "}
            </button>
                     {" "}
          </form>
                   {" "}
          <div className="extra-links">
                       {" "}
            <p
              className="forgot-link"
              onClick={() => setIsForgotPasswordOpen(true)}
            >
                            Forgot password?            {" "}
            </p>
                       {" "}
            <div className="separator">
                            <span className="separator-line"></span>           
                <span className="separator-text">or</span>             {" "}
              <span className="separator-line"></span>           {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className="signup-section">
                       {" "}
            <p>
              Don't have an account?{" "}
              <a
                href="#"
                className="signup-link"
                onClick={(e) => {
                  e.preventDefault();
                  signupPage();
                }}
              >
                                Sign-up              {" "}
              </a>
            </p>
                     {" "}
          </div>
                   {" "}
          <div className="footer-links">
                       {" "}
            <p
              className="footer-link"
              onClick={() => setShowTerms(true)} // Open Terms and Conditions Modal
            >
                            Terms & Conditions            {" "}
            </p>
                       {" "}
            <p
              className="footer-link"
              onClick={() => setShowCustomerCare(true)} // Open Customer Care Modal
            >
                            Customer Care            {" "}
            </p>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
            {/* Forgot Password Modal */}     {" "}
      <Dialog open={isForgotPasswordOpen} onClose={handleCloseModal}>
                <DialogTitle>Forgot Password</DialogTitle>       {" "}
        <DialogContent>
                    {error && <p style={{ color: "red" }}>{error}</p>}         {" "}
          {!otpFieldVisible ? (
            <>
                           {" "}
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
                           {" "}
              <Button
                onClick={handleSendOTP}
                disabled={loading}
                color="primary"
              >
                                {loading ? "Sending..." : "Send OTP"}           
                 {" "}
              </Button>
                         {" "}
            </>
          ) : (
            <>
                           {" "}
              <input
                type="text"
                placeholder="Enter OTP"
                className="input-field"
                value={resetOTP}
                onChange={(e) => setResetOTP(e.target.value)}
                required
              />
                           {" "}
              <div className="password-field" style={{ marginTop: "15px" }}>
                               {" "}
                <input
                  type={newPasswordVisible ? "text" : "password"}
                  placeholder="New Password"
                  className="input-field"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                               {" "}
                {newPasswordVisible ? (
                  <Eye
                    className="eye-icon"
                    size={20}
                    onClick={() => setNewPasswordVisible(false)}
                  />
                ) : (
                  <EyeOff
                    className="eye-icon"
                    size={20}
                    onClick={() => setNewPasswordVisible(true)}
                  />
                )}
                             {" "}
              </div>
                           {" "}
              <Button
                onClick={handleResetPassword}
                disabled={loading}
                color="primary"
                style={{ marginTop: "15px" }}
              >
                                {loading ? "Resetting..." : "Reset Password"}   
                         {" "}
              </Button>
                         {" "}
            </>
          )}
                 {" "}
        </DialogContent>
               {" "}
        <DialogActions>
                   {" "}
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
                 {" "}
        </DialogActions>
             {" "}
      </Dialog>
            {/* Terms and Conditions Modal */}     {" "}
      <Dialog open={showTerms} onClose={() => setShowTerms(false)}>
                <DialogTitle>Terms and Conditions</DialogTitle>       {" "}
        <DialogContent>
                    <p>By using DEF, you agree to the following terms:</p>     
             {" "}
          <ul>
                       {" "}
            <li>
                            Users must agree to the Terms before using DEF. If
              they’re under               18, they need parental consent.      
                   {" "}
            </li>
                       {" "}
            <li>
                            DEF uses AI to analyze facial emotions in real-time
              and suggests               movies that match your emotional state.
              These recommendations are               for entertainment
              purposes.            {" "}
            </li>
                       {" "}
            <li>
                            Your emotional data is processed live through your
              webcam and not               stored unless clearly stated. We
              respect your privacy and handle               all data
              responsibly.            {" "}
            </li>
                       {" "}
            <li>
                            All designs, software, and content belong to DEF.
              You can’t copy               or reuse anything without permission.
                         {" "}
            </li>
                       {" "}
            <li>
                            Emotion detection is based on AI and may not always
              be accurate.               Recommendations are not guaranteed to
              match your mood or               preferences exactly.            {" "}
            </li>
                       {" "}
            <li>
                            We’re not responsible for any issues caused by using
              the platform,               including inaccurate suggestions or
              technical problems.            {" "}
            </li>
                     {" "}
          </ul>
                 {" "}
        </DialogContent>
               {" "}
        <DialogActions>
                   {" "}
          <Button onClick={() => setShowTerms(false)} color="primary">
                        Close          {" "}
          </Button>
                 {" "}
        </DialogActions>
             {" "}
      </Dialog>
            {/* Customer Care Modal */}     {" "}
      <Dialog
        open={showCustomerCare}
        onClose={() => setShowCustomerCare(false)}
      >
                <DialogTitle>Customer Care</DialogTitle>       {" "}
        <DialogContent>
                    <p>Email: abdullah5601013@gmail.com</p>         {" "}
          <p>Contact Number: 03075601013</p>       {" "}
        </DialogContent>
               {" "}
        <DialogActions>
                   {" "}
          <Button onClick={() => setShowCustomerCare(false)} color="primary">
                        Close          {" "}
          </Button>
                 {" "}
        </DialogActions>
             {" "}
      </Dialog>
         {" "}
    </>
  );
};

export default LoginPage;
