import { Link } from "react-router";
import { BiDonateHeart } from "react-icons/bi";
import { FiClock, FiUsers } from "react-icons/fi";
import { RiArrowRightSLine } from "react-icons/ri";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import { useAuth, useDonationDraft, useDonations } from "../context/contexts";
import { isDemoMode } from "../services/api";
import shared from "../styles/shared.module.css";
import styles from "./Profile.module.css";

const shortcuts = [
  { to: "/activity", label: "Donation history", icon: FiClock },
  { to: "/donate", label: "Donate food", icon: BiDonateHeart },
  { to: "/ngos", label: "Browse NGOs", icon: FiUsers },
];

export default function Profile() {
  const { user, signOut } = useAuth();
  const { donations, clearDonations } = useDonations();
  const { resetDraft } = useDonationDraft();

  const activeDonations = donations.filter((donation) => donation.status !== "Cancelled");
  const servingsShared = activeDonations.reduce((total, donation) => total + donation.servings, 0);
  const displayName = user.name || "Donor";

  const handleSignOut = () => {
    resetDraft();
    signOut();
  };

  const handleClearData = () => {
    if (window.confirm("Delete all demo donations saved in this browser?")) {
      clearDonations();
      resetDraft();
    }
  };

  return (
    <>
      <title>Profile · ShareTheMeal</title>
      <PageHeader title="Profile" />
      <div className={shared.page}>
        <section className={styles.identity}>
          <Avatar imageUrl={user.profilePic} name={displayName} size={88} />
          <h2 className={styles.name}>{displayName}</h2>
          {user.email ? <p className={shared.message}>{user.email}</p> : null}
        </section>

        <dl className={styles.stats}>
          <div>
            <dt>Donations</dt>
            <dd>{activeDonations.length}</dd>
          </div>
          <div>
            <dt>Servings shared</dt>
            <dd>{servingsShared}</dd>
          </div>
        </dl>

        <nav aria-label="Shortcuts">
          <ul className={styles.links}>
            {shortcuts.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link className={styles.link} to={to}>
                  <Icon aria-hidden="true" className={styles.linkIcon} />
                  <span>{label}</span>
                  <RiArrowRightSLine aria-hidden="true" className={styles.chevron} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {isDemoMode ? (
          <section className={styles.demo}>
            <p>You're using the demo. Donations are saved in this browser only.</p>
            <Button disabled={!donations.length} onClick={handleClearData} variant="danger">
              Clear demo data
            </Button>
          </section>
        ) : null}

        <Button onClick={handleSignOut} variant="secondary">
          Sign out
        </Button>
      </div>
    </>
  );
}
