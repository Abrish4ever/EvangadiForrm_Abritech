import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import styles from "./Header.module.css";
import Logo from "../../assets/images/DarkLogo.png";
import { FiMenu, FiX } from "react-icons/fi";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/users/login");
    setMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (token) {
      navigate("/home");
    } else {
      navigate("/");
    }
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={styles.header}>
        {/* Logo - Only image, no text */}
        <div className={styles.logoContainer} onClick={handleLogoClick}>
          <img src={Logo} alt="Evangadi Logo" className={styles.logoImage} />
        </div>

        {/* Mobile Menu Button */}
        <div
          className={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </div>

        {/* Navigation */}
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          <ul className={styles.navList}>
            <li>
              <Link
                to={token ? "/home" : "/"}
                className={`${styles.navLink} ${
                  location.pathname === "/" || location.pathname === "/home"
                    ? styles.active
                    : ""
                }`}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/how-it-works"
                className={`${styles.navLink} ${
                  location.pathname === "/how-it-works" ? styles.active : ""
                }`}
                onClick={closeMenu}
              >
                How it Works
              </Link>
            </li>

            {token ? (
              <>
                <li>
                  <Link
                    to="/ask"
                     className={`${styles.navLink} ${
                  location.pathname === "/ask" ? styles.active : ""
                }`}
                    // className={styles.askQuestionLink}
                    onClick={closeMenu}
                  >
                    Ask Question
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogOut} className={styles.logoutBtn}>
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <li className={styles.signInContainer}>
                <Link
                  to="/users/login"
                  className={styles.signInBtn}
                  onClick={closeMenu}
                >
                  SIGN IN
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Overlay for mobile */}
        {menuOpen && <div className={styles.overlay} onClick={closeMenu} />}
      </header>
      {/* Add spacing to prevent content from being hidden behind fixed header */}
      <div className={styles.headerSpacer}></div>
    </>
  );
}

export default Header;
