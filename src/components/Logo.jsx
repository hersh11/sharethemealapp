import { useId } from "react";
import styles from "./Logo.module.css";

export default function Logo({ size = 36, showName = true, className }) {
  const gradientId = useId();

  return (
    <span className={[styles.logo, className].filter(Boolean).join(" ")}>
      <svg aria-hidden="true" className={styles.mark} height={size} viewBox="0 0 64 64" width={size}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#7c3aed" />
            <stop offset="1" stopColor="#c026d3" />
          </linearGradient>
        </defs>
        <rect fill={`url(#${gradientId})`} height="64" rx="16" width="64" />
        <path d="M14 36h36a18 18 0 0 1-36 0z" fill="#fff" />
        <path d="M10 36h44" stroke="#fff" strokeLinecap="round" strokeWidth="4" />
        <path
          d="M26 14c-3 4 3 6 0 10M34 12c-3 4 3 6 0 10M42 14c-3 4 3 6 0 10"
          fill="none"
          stroke="#fde68a"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
      {showName ? (
        <span className={styles.name}>
          ShareThe<span>Meal</span>
        </span>
      ) : null}
    </span>
  );
}
