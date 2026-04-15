import { Link } from "react-router-dom";
import styles from "./Button.module.css";

const Button = ({ text, to, type = "button", onClick, disabled = false }) => {
  const className = [styles.button, disabled ? styles.disabled : ""].join(" ").trim();

  if (to) {
    return (
      <Link aria-disabled={disabled} className={className} onClick={onClick} to={to}>
        {text}
      </Link>
    );
  }

  return (
    <button className={className} disabled={disabled} onClick={onClick} type={type}>
      {text}
    </button>
  );
};

export default Button;
