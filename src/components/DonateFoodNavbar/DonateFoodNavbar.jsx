import { Link } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
import styles from "./donateFoodNavbar.module.css";

const DonateFoodNavbar = ({ link, title = "Donate Food" }) => {
  return (
    <div className={styles.navbar}>
      <Link aria-label="Go back" className={styles.link} to={link}>
        <RiArrowLeftSLine />
      </Link>
      <p className={styles.heading}>{title}</p>
    </div>
  );
};

export default DonateFoodNavbar;
