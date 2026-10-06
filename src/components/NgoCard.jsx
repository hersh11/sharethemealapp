import { Link } from "react-router";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { CgBowl } from "react-icons/cg";
import { GiAlarmClock } from "react-icons/gi";
import { RiMapPin2Line } from "react-icons/ri";
import { formatDistance } from "../lib/geo";
import Avatar from "./Avatar";
import styles from "./NgoCard.module.css";

export default function NgoCard({ ngo, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  const hasDistance = Number.isFinite(ngo.distanceKm);

  return (
    <Link className={styles.card} to={`/ngos/${ngo.id}`}>
      <Avatar art={ngo.avatar} name={ngo.name} size={56} />
      <div className={styles.body}>
        <Heading className={styles.name}>{ngo.name}</Heading>
        <p className={styles.area}>
          {ngo.area}
          {hasDistance ? (
            <span className={styles.distance}>
              <RiMapPin2Line aria-hidden="true" /> {formatDistance(ngo.distanceKm)} away
            </span>
          ) : null}
        </p>
        <div className={styles.meta}>
          <span>
            <CgBowl aria-hidden="true" /> {ngo.mealsNeeded} meals needed
          </span>
          {ngo.neededBy ? (
            <span>
              <GiAlarmClock aria-hidden="true" /> {ngo.neededBy}
            </span>
          ) : null}
        </div>
      </div>
      <BsArrowRightCircleFill aria-hidden="true" className={styles.arrow} />
    </Link>
  );
}
