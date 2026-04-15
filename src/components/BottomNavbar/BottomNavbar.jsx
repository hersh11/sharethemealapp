import { CgProfile } from "react-icons/cg";
import { BiHomeAlt, BiDonateHeart } from "react-icons/bi";
import { GrLocation } from "react-icons/gr";
import { RiTimeLine } from "react-icons/ri";
import styles from "./bottomNavbar.module.css";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", icon: BiHomeAlt, exact: true },
  { to: "/", label: "Activity", icon: RiTimeLine, exact: true },
  { to: "/donationType", label: "Donate", icon: BiDonateHeart },
  { label: "Hunger Spot", icon: GrLocation, disabled: true },
  { to: "/profile", label: "Profile", icon: CgProfile },
];

const BottomNavbar = () => {
  return (
    <div className={styles.navbar}>
      {navItems.map(({ to, label, icon: Icon, exact, disabled }) => {
        const classes = [styles.link, disabled ? styles.disable : ""].join(" ").trim();

        if (disabled) {
          return (
            <div className={classes} key={label}>
              <Icon className={styles.icon} />
              <p className={styles.link_text}>{label}</p>
            </div>
          );
        }

        return (
          <NavLink
            activeClassName={styles.active}
            className={classes}
            exact={exact}
            key={label}
            to={to}
          >
            <Icon className={styles.icon} />
            <p className={styles.link_text}>{label}</p>
          </NavLink>
        );
      })}
    </div>
  );
};

export default BottomNavbar;
