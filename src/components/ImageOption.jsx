import styles from "./ImageOption.module.css";

// A large tappable card with a banner image. `selected` is optional; pass it
// when the card represents a choice that stays selected.
export default function ImageOption({ image, title, description, onClick, selected }) {
  return (
    <button aria-pressed={selected} className={styles.option} onClick={onClick} type="button">
      <img alt="" className={styles.image} height="282" src={image} width="800" />
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
      </span>
    </button>
  );
}
