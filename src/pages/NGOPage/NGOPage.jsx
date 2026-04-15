import styles from "./ngoPage.module.css";

import { HiBadgeCheck } from "react-icons/hi";

import BottomNavbar from "../../components/BottomNavbar";
import DonateFoodNavbar from "../../components/DonateFoodNavbar";
import Button from "../../components/Button";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const NGOPage = ({ data = [], setDonationContact }) => {
  const { id } = useParams();
  const ngoData = useMemo(
    () => data.find((ngo) => String(ngo.id) === id) || null,
    [data, id]
  );

  if (!ngoData) {
    return (
      <>
        <DonateFoodNavbar link="/all" />
        <BottomNavbar />
        <div className={styles.main}>
          <p>We could not find this NGO.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <DonateFoodNavbar link="/all" />
      <BottomNavbar />
      <div className={styles.main}>
        <div className={styles.ngo_details}>
          <div className={styles.image_section}>
            <img src={ngoData.image} alt={ngoData.NGOName} />
            <div className={styles.title}>
              <p>{ngoData.NGOName}</p>
              <HiBadgeCheck className={styles.icon} />
            </div>
          </div>
          <div className={styles.grid}>
            <div className={styles.item}>
              <p className={styles.detail}>{ngoData.reviews}</p>
              <p className={styles.para}>Reviews</p>
            </div>
            <div className={styles.item}>
              <p className={styles.detail}>{ngoData.totalFeeds}+</p>
              <p className={styles.para}>Total Feeds</p>
            </div>
            <div className={styles.item}>
              <p className={styles.detail}>{ngoData.totalCampaigns}+</p>
              <p className={styles.para}>Total Campaigns</p>
            </div>
            <div className={styles.item}>
              <p className={styles.detail}>{ngoData.totalVolunteers}+</p>
              <p className={styles.para}>Total Volunteers</p>
            </div>
          </div>
          <div className={styles.button}>
            <Button
              onClick={() =>
                setDonationContact((currentContact) => ({
                  ...currentContact,
                  ngoId: ngoData.id,
                  ngoName: ngoData.NGOName,
                }))
              }
              text="Donate Now"
              to="/category"
            />
          </div>
        </div>

        <div className={styles.about}>
          <div className={styles.about_top}>
            <p>About</p>
            <p>Events</p>
            <p>Reviews</p>
          </div>
          <div className={styles.about_bottom}>
            <p>{ngoData.about}</p>
            <div className={styles.buttons}>
              <button>Chat</button>
              <button>Volunteer</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NGOPage;
