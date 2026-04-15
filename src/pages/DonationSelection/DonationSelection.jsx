import BottomNavbar from "../../components/BottomNavbar";
import styles from "./donationSelection.module.css";
import DonateFoodNavbar from "../../components/DonateFoodNavbar";
import { Link } from "react-router-dom";
import { donationOptions } from "../../constants/donation";

const DonationSelection = () => {
  return (
    <>
      <DonateFoodNavbar link="/all" />
      <BottomNavbar />

      <div className={styles.main}>
        <h1>Choose where you want to Donate</h1>
        <div className={styles.image_section}>
          {donationOptions.map((option) => (
            <Link key={option.label} to={option.to}>
              <img alt={option.label} src={option.image} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default DonationSelection;
