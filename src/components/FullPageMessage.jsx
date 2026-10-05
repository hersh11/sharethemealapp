import styles from "./FullPageMessage.module.css";

export default function FullPageMessage({ title, children, role }) {
  return (
    <div className={styles.wrapper} role={role}>
      <div className={styles.content}>
        {title ? <h1 className={styles.title}>{title}</h1> : null}
        {children}
      </div>
    </div>
  );
}
