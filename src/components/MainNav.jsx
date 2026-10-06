import { Link, NavLink } from "react-router";
import { BiDonateHeart, BiHomeAlt } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { RiTeamLine, RiTimeLine } from "react-icons/ri";
import { isDemoMode } from "../services/api";
import Logo from "./Logo";
import styles from "./MainNav.module.css";

const navItems = [
  { to: "/", label: "Home", icon: BiHomeAlt, end: true },
  { to: "/ngos", label: "NGOs", icon: RiTeamLine },
  { to: "/donate", label: "Donate", icon: BiDonateHeart },
  { to: "/activity", label: "Activity", icon: RiTimeLine },
  { to: "/profile", label: "Profile", icon: CgProfile },
];

// A bottom tab bar on phones and a sidebar on wider screens.
export default function MainNav() {
  return (
    <nav aria-label="Main" className={styles.nav}>
      <Link aria-label="ShareTheMeal home" className={styles.brand} to="/">
        <Logo size={38} />
      </Link>
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
      {isDemoMode ? (
        <p className={styles.note}>Demo version. The NGOs are fictional and your data stays in this browser.</p>
      ) : null}
    </nav>
  );
}
