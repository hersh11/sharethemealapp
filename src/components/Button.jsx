import { Link } from "react-router";
import styles from "./Button.module.css";

export default function Button({ to, variant = "primary", size, className, children, ...props }) {
  const classes = [styles.button, styles[variant], size && styles[size], className]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}
