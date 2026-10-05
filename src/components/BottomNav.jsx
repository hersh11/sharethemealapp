import { NavLink } from "react-router";
import { BiDonateHeart, BiHomeAlt } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { RiTimeLine } from "react-icons/ri";
import styles from "./BottomNav.module.css";

const navItems = [
  { to: "/", label: "Home", icon: BiHomeAlt, end: true },
  { to: "/donate", label: "Donate", icon: BiDonateHeart },
  { to: "/activity", label: "Activity", icon: RiTimeLine },
  { to: "/profile", label: "Profile", icon: CgProfile },
];

export default function BottomNav() {
  return (
    <nav aria-label="Main" className={styles.nav}>
      <ul className={styles.list}>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              className={({ isActive }) => [styles.link, isActive && styles.active].filter(Boolean).join(" ")}
              end={end}
              to={to}
            >
              <Icon aria-hidden="true" className={styles.icon} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
