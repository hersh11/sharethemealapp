import { Link } from "react-router";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { CgBowl } from "react-icons/cg";
import { GiAlarmClock } from "react-icons/gi";
import Avatar from "./Avatar";
import styles from "./NgoCard.module.css";

export default function NgoCard({ ngo, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;

  return (
    <Link className={styles.card} to={`/ngos/${ngo.id}`}>
      <Avatar name={ngo.name} size={52} />
      <div className={styles.body}>
        <Heading className={styles.name}>{ngo.name}</Heading>
        {ngo.area ? <p className={styles.area}>{ngo.area}</p> : null}
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
