import { Link } from "react-router";
import { RiArrowLeftSLine } from "react-icons/ri";
import styles from "./PageHeader.module.css";

export default function PageHeader({ title, subtitle, backTo }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {backTo ? (
          <Link aria-label="Back" className={styles.back} to={backTo}>
            <RiArrowLeftSLine aria-hidden="true" />
          </Link>
        ) : null}
        <div className={styles.text}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>
      </div>
    </header>
  );
}
