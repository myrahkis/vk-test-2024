import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";

function NavBar() {
  return (
    <div className={styles.navBar}>
      <NavLink
        to={"/"}
        className={({ isActive }) => {
          return isActive ? styles.active : styles.navLink;
        }}
      >
        Home
      </NavLink>
      <NavLink
        to={"/cat-fact"}
        className={({ isActive }) => {
          return isActive ? styles.active : styles.navLink;
        }}
      >
        Get cat fact
      </NavLink>
      <NavLink
        to={"/get-your-age"}
        className={({ isActive }) => {
          return isActive ? styles.active : styles.navLink;
        }}
      >
        Get your age
      </NavLink>
    </div>
  );
}

export default NavBar;
