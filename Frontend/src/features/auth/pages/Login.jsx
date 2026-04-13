import React, { useState } from "react";
import "./Login.scss";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../hook/useAuth'
import { useSelector } from "react-redux";
import { motion, useMotionValue, useTransform } from "framer-motion";
import FloatingLabelInput from "../components/FloatingLabelInput";
const Login = () => {
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);
  const { handleLogin } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [focused, setFocused] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Calculate values from -1 to 1 based on mouse position
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const xOffset = useTransform(mouseX, [-1, 1], [-15, 15]);
  const yOffset = useTransform(mouseY, [-1, 1], [-15, 15]);
  const insetXOffset = useTransform(mouseX, [-1, 1], [15, -15]); // Opposite direction for 3D feel
  const insetYOffset = useTransform(mouseY, [-1, 1], [15, -15]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const slideUpItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.4 } }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await handleLogin({
        email: formData.email,
        password: formData.password
      })
      navigate('/')
    }
    catch (err) {
      console.log(err)
    }
    // TODO: connect handleLogin when API is ready
  };

const handleGoogleAuth = () => {
  window.location.href = "http://localhost:3000/api/auth/google";
};

  return (
    <div className="rp-wrapper" onMouseMove={handleMouseMove}>
      <div className="global-texture" />
      {/* ══════════════════ LEFT — EDITORIAL ══════════════════ */}
      <div className="rp-left" aria-hidden="true">
        <motion.div 
          className="editorial-bg"
          style={{ x: xOffset, y: yOffset }}
        >
          <img
            src="https://images.unsplash.com/photo-1674465527571-f8d068b3c516?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Streetwear Look"
            className="editorial-img"
          />
        </motion.div>

        <div className="editorial-overlay" />

        <div className="editorial-content">
          <p className="brand-subheading">WELCOME BACK TO THE CREW.</p>
          <div className="brand-wordmark">
            <span className="wordmark-text">SNITCH</span>
          </div>
        </div>

        <motion.div 
          className="editorial-inset"
          style={{ x: insetXOffset, y: insetYOffset }}
        >
          <img
            src="https://images.unsplash.com/photo-1674465521712-21c494938666?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Fabric detail"
            className="inset-img"
          />
          <div className="inset-meta">
            <span className="inset-label">STYLE_02</span>
          </div>
        </motion.div>

        <div className="left-meta-bar">
          <span className="meta-item">FW — 2025</span>
          <span className="meta-dot" />
          <span className="meta-item">MEMBERS ONLY</span>
          <span className="meta-dot" />
          <span className="meta-item">© SNITCH.CO.IN</span>
        </div>
      </div>

      {/* ══════════════════ RIGHT — FORM ══════════════════ */}
      <div className="rp-right">
        <motion.div 
          className="form-panel"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div className="form-header" variants={slideUpItem}>
            <p className="form-eyebrow">EXISTING MEMBER</p>
            <h1 className="form-heading">
              SIGN  IN
            </h1>
          </motion.div>

          <form className="reg-form" onSubmit={handleSubmit} noValidate>
            
            {error?.general && (
              <motion.p variants={slideUpItem} style={{ color: "red", marginBottom: "10px" }}>
                {error.general}
              </motion.p>
            )}

            {/* Email */}
            <motion.div variants={slideUpItem}>
              <FloatingLabelInput
                id="email"
                label="EMAIL"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={error?.email}
                autoComplete="email"
                required
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={slideUpItem}>
              <FloatingLabelInput
                id="password"
                label="PASSWORD"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={error?.password}
                autoComplete="current-password"
                required
                showPasswordToggle
              />
            </motion.div>

            <motion.div className="forgot-password" variants={slideUpItem}>
              <Link to="/forgot-password">Forgot password?</Link>
            </motion.div>

            <motion.button type="submit" className="btn-register" id="btn-login" variants={slideUpItem}>
              <span className="btn-register__text">SIGN IN</span>
            </motion.button>
          </form>

          <motion.div className="or-divider" variants={slideUpItem}>
            <span className="or-line" />
            <span className="or-label">OR</span>
            <span className="or-line" />
          </motion.div>

          <motion.button
            type="button"
            className="btn-google"
            id="btn-google"
            onClick={handleGoogleAuth}
            variants={slideUpItem}
          >
            <svg className="g-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </motion.button>

          <motion.p className="auth-redirect" variants={slideUpItem}>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link" id="link-register">
              Create one
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
