import { useLocation } from "react-router";
import { IoIosCheckmarkCircle } from "react-icons/io";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import { useDonations } from "../context/contexts";
import { formatDateTime, formatDay, formatHours, formatTime } from "../lib/dates";
import shared from "../styles/shared.module.css";
import styles from "./Activity.module.css";

const statusClass = {
  "Pickup requested": styles.statusPickup,
  "Drop-off scheduled": styles.statusDropOff,
  Cancelled: styles.statusCancelled,
};

function DonationCard({ donation, isNew, onCancel }) {
  const headingId = `donation-${donation.id}`;
  const recipientName = donation.recipient?.name ?? "Community donation";
  const cookedNote =
    donation.preparedHoursAgo === null
      ? ""
      : donation.preparedHoursAgo === 0
        ? " · freshly cooked"
        : ` · cooked ${formatHours(donation.preparedHoursAgo)} before posting`;

  return (
    <article aria-labelledby={headingId} className={[styles.card, isNew && styles.new].filter(Boolean).join(" ")}>
      <div className={styles.cardHeader}>
        <h2 className={styles.recipient} id={headingId}>
          {recipientName}
        </h2>
        <span className={[styles.status, statusClass[donation.status]].filter(Boolean).join(" ")}>
          {donation.status}
        </span>
      </div>
      <dl className={styles.details}>
        <div>
          <dt>Food</dt>
          <dd>
            {donation.category} · {donation.foodType} · {donation.meals.join(", ")}
          </dd>
        </div>
        <div>
          <dt>Feeds</dt>
          <dd>
            {donation.servings} people{cookedNote}
          </dd>
        </div>
        <div>
          <dt>{donation.deliveryMode === "Pickup" ? "Pickup" : "Drop-off"}</dt>
          <dd>
            {formatDay(donation.date)} at {formatTime(donation.time)}
          </dd>
        </div>
        <div>
          <dt>Address</dt>
          <dd>{donation.address}</dd>
        </div>
      </dl>
      <div className={styles.cardFooter}>
        <span>Posted {formatDateTime(donation.createdAt)}</span>
        {donation.status !== "Cancelled" ? (
          <Button onClick={() => onCancel(donation)} size="small" variant="danger">
            Cancel donation
          </Button>
        ) : null}
      </div>
    </article>
  );
}

export default function Activity() {
  const { donations, cancelDonation } = useDonations();
  const { state } = useLocation();
  const postedId = state?.postedId;
  const justPosted = postedId ? donations.find((donation) => donation.id === postedId) : null;

  const handleCancel = (donation) => {
    const name = donation.recipient?.name ?? "this donation";

    if (window.confirm(`Cancel your donation for ${name}?`)) {
      cancelDonation(donation.id);
    }
  };

  return (
    <>
      <title>Activity · ShareTheMeal</title>
      <PageHeader title="Activity" />
      <div className={shared.page}>
        {justPosted ? (
          <div className={styles.success} role="status">
            <IoIosCheckmarkCircle aria-hidden="true" className={styles.successIcon} />
            <div>
              <p className={styles.successTitle}>Donation posted</p>
              <p>
                Your donation for {justPosted.recipient.name} is live. You can track or cancel it here.
              </p>
            </div>
          </div>
        ) : null}

        {donations.length ? (
          <ul className={styles.grid}>
            {donations.map((donation) => (
              <li key={donation.id}>
                <DonationCard donation={donation} isNew={donation.id === postedId} onCancel={handleCancel} />
              </li>
            ))}
          </ul>
        ) : (
          <div className={`${shared.card} ${styles.empty}`}>
            <h2 className={shared.sectionTitle}>No donations yet</h2>
            <p className={shared.message}>Donations you post will show up here.</p>
            <Button to="/donate">Donate food</Button>
          </div>
        )}
      </div>
    </>
  );
}
