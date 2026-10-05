import styles from "./Avatar.module.css";

const palette = [
  ["#ede9fe", "#5b21b6"],
  ["#fef3c7", "#92400e"],
  ["#dcfce7", "#166534"],
  ["#e0f2fe", "#075985"],
  ["#fce7f3", "#9d174d"],
];

const hashString = (value) =>
  [...value].reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 7);

export default function Avatar({ name, imageUrl, size = 48 }) {
  const dimensions = { width: size, height: size };

  if (imageUrl) {
    return <img alt="" className={styles.avatar} src={imageUrl} style={dimensions} />;
  }

  const [background, color] = palette[hashString(name) % palette.length];
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <span
      aria-hidden="true"
      className={styles.avatar}
      style={{ ...dimensions, background, color, fontSize: Math.round(size * 0.36) }}
    >
      {initials}
    </span>
  );
}
