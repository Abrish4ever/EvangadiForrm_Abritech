import React from "react";
import Logo from "../../assets/images/lightLogo.png";
import styles from "./Footer.module.css";
import { FaFacebook, FaInstagram, FaYoutube, FaLink } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.mainContent}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.logoContainer}>
              <img src={Logo} alt="Evangadi Networks" className={styles.logo} />
            </div>
            <p className={styles.tagline}>
              Connecting learners and professionals through knowledge sharing
            </p>
            <div className={styles.socialLinks}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="http://www.youtube.com/@EvangadiTech"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="YouTube"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linksSection}>
            <h3 className={styles.sectionTitle}>Quick Links</h3>
            <ul className={styles.linksList}>
              <li>
                <a href="/" className={styles.footerLink}>
                  <FaLink size={12} />
                  Home
                </a>
              </li>
              <li>
                <a href="/how-it-works" className={styles.footerLink}>
                  <FaLink size={12} />
                  How It Works
                </a>
              </li>
              <li>
                <a href="/ask" className={styles.footerLink}>
                  <FaLink size={12} />
                  Ask Question
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.contactSection}>
            <h3 className={styles.sectionTitle}>Contact Info</h3>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <strong>Evangadi Networks</strong>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Email:  </span>
                <a
                  href="mailto:support@evangadi.com"
                  className={styles.contactLink}
                >
                  support@evangadi.com
                </a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Phone:  </span>
                <a href="tel:+1-202-386-2702" className={styles.contactLink}>
                  +1-202-386-2702
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            © {currentYear} Evangadi Networks. All rights reserved.
          </div>
          <div className={styles.legalLinks}>
            <a href="/privacy" className={styles.legalLink}>
              Privacy Policy
            </a>
            <a href="/terms" className={styles.legalLink}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
