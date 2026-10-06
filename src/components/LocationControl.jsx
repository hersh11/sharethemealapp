import { BiCurrentLocation } from "react-icons/bi";
import { formatDistance } from "../lib/geo";
import styles from "./LocationControl.module.css";

// Beyond this the demo NGOs aren't really "near" the visitor, so say so.
const FAR_AWAY_KM = 50;

export default function LocationControl({ location, nearest }) {
  const { status, requestLocation } = location;

  if (status === "ready") {
    if (nearest && Number.isFinite(nearest.distanceKm) && nearest.distanceKm > FAR_AWAY_KM) {
      return (
        <p className={styles.note} role="status">
          Sorted by distance. These demo NGOs are in Pune, {formatDistance(nearest.distanceKm)} from you.
        </p>
      );
    }

    return (
      <p className={styles.note} role="status">
        <BiCurrentLocation aria-hidden="true" /> Sorted by distance from you
      </p>
    );
  }

  if (status === "denied") {
    return (
      <p className={styles.note} role="status">
        Location is blocked. Allow it for this site in your browser to sort NGOs by distance.
      </p>
    );
  }

  return (
    <div className={styles.row}>
      <button className={styles.button} disabled={status === "locating"} onClick={requestLocation} type="button">
        <BiCurrentLocation aria-hidden="true" />
        {status === "locating" ? "Finding you…" : "Sort by distance"}
      </button>
      {status === "unavailable" ? (
        <span className={styles.hint} role="status">
          Couldn't get your location. Try again?
        </span>
      ) : null}
    </div>
  );
}
