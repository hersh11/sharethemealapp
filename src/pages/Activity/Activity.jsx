import BottomNavbar from "../../components/BottomNavbar";
import styles from "./activity.module.css";

const Activity = ({ donations = [], isLoading, error }) => {
  return (
    <>
      <BottomNavbar />
      <div className={styles.main}>
        <h1>Activity</h1>
        <p className={styles.subtitle}>
          Track the donations you have posted and how they will be fulfilled.
        </p>

        {isLoading ? <p className={styles.message}>Loading activity...</p> : null}
        {!isLoading && error ? <p className={styles.error}>{error}</p> : null}
        {!isLoading && !error && donations.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No donations yet</h2>
            <p>Your posted donations will appear here after you complete the flow.</p>
          </div>
        ) : null}

        {!isLoading && donations.length > 0 ? (
          <div className={styles.list}>
            {donations.map((donation) => (
              <article className={styles.card} key={donation.id}>
                <div className={styles.row}>
                  <div>
                    <h2>{donation.ngoName}</h2>
                    <p>{donation.categoryLabel}</p>
                  </div>
                  <span className={styles.status}>{donation.status}</span>
                </div>
                <p className={styles.meta}>
                  {donation.foodType} | {donation.meals.join(", ")}
                </p>
                <p className={styles.meta}>
                  {donation.quantity} servings | Prepared {donation.preparedHours} hrs ago
                </p>
                <p className={styles.meta}>
                  {donation.deliveryMode} | Pickup by {donation.date} at {donation.time}
                </p>
                <p className={styles.meta}>{donation.location}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Activity;
