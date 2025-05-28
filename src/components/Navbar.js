import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBars } from 'react-icons/fa';
import styles from './Navbar.module.css';

const Navbar = () => (
  <nav className={styles.navbar}>
    <div className={styles.logo}>Remote Sensing Feature Extractor</div>
    <div className={styles.navLinks}>
      <Link to="/" className={styles.navLink}>Map</Link>
      <Link to="/weather" className={styles.navLink}>Weather</Link>
      <Link to="/soil" className={styles.navLink}>Soil Quality</Link>
      <Link to="/roads" className={styles.navLink}>Road Extraction</Link>
    </div>
  </nav>
);

export default Navbar;