import { NavLink } from "react-router";
import styles from "./header.module.css";

export default function Header() {
  return (
    <nav className={styles.header}>
      <NavLink to="/">Spill</NavLink>
      <NavLink to="/howtowin">Regler</NavLink>
      <NavLink to="/players">Spillere</NavLink>
    </nav>
  );
}
