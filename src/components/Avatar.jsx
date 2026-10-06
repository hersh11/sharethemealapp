import { GiCook, GiForkKnifeSpoon, GiHotMeal, GiWheat } from "react-icons/gi";
import { MdDeliveryDining } from "react-icons/md";
import styles from "./Avatar.module.css";

const artIcons = {
  utensils: GiForkKnifeSpoon,
  scooter: MdDeliveryDining,
  meal: GiHotMeal,
  chef: GiCook,
  wheat: GiWheat,
};

const palette = [
  ["#7c3aed", "#a855f7"],
  ["#d97706", "#f59e0b"],
  ["#059669", "#10b981"],
  ["#0284c7", "#38bdf8"],
  ["#db2777", "#f472b6"],
];

const hashString = (value) =>
  [...value].reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 7);

// An NGO's picture: its photo if it has one, otherwise an illustrated icon on
// its brand gradient, otherwise its initials.
export default function Avatar({ name, imageUrl, art, size = 48 }) {
  const dimensions = { width: size, height: size };

  if (imageUrl) {
    return <img alt="" className={styles.avatar} src={imageUrl} style={dimensions} />;
  }

  const Icon = art ? artIcons[art.icon] : null;
  const [from, to] = art?.colors ?? palette[hashString(name) % palette.length];
  const style = {
    ...dimensions,
    background: `linear-gradient(135deg, ${from}, ${to})`,
    boxShadow: `0 8px 18px -6px ${from}aa`,
  };

  if (Icon) {
    return (
      <span aria-hidden="true" className={`${styles.avatar} ${styles.art}`} style={style}>
        <Icon style={{ fontSize: Math.round(size * 0.52) }} />
      </span>
    );
  }

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <span
      aria-hidden="true"
      className={`${styles.avatar} ${styles.art}`}
      style={{ ...style, fontSize: Math.round(size * 0.36) }}
    >
      {initials}
    </span>
  );
}
