import styles from "./deliverSelection.module.css";
import BottomNavbar from "../../components/BottomNavbar";
import { useState } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import Button from "../../components/Button";
import { appImages } from "../../constants/assets";
import DonateFoodNavbar from "../../components/DonateFoodNavbar";
import { useHistory } from "react-router-dom";

const DeliverSelection = ({
  foodData,
  donationContact,
  createDonation,
  resetDonationFlow,
}) => {
  const history = useHistory();
  const [submissionState, setSubmissionState] = useState({
    isLoading: false,
    isModalOpen: false,
    error: "",
  });

  const handleSubmit = async (deliveryMode) => {
    if (!foodData.meals.length || !donationContact.location || !donationContact.date) {
      history.push("/confirmFoodDetails");
      return;
    }

    setSubmissionState({
      isLoading: true,
      isModalOpen: false,
      error: "",
    });

    try {
      await createDonation({
        ngoId: donationContact.ngoId,
        ngoName: donationContact.ngoName || "General community donation",
        categoryLabel: foodData.category,
        foodType: foodData.type,
        meals: foodData.meals,
        quantity: foodData.quantity,
        preparedHours: foodData.preparedHours,
        location: donationContact.location,
        phone: donationContact.phone,
        date: donationContact.date,
        time: donationContact.time,
        deliveryMode,
      });
      resetDonationFlow();
      setSubmissionState({
        isLoading: false,
        isModalOpen: true,
        error: "",
      });
    } catch (error) {
      setSubmissionState({
        isLoading: false,
        isModalOpen: false,
        error: "We could not save your donation. Please try again.",
      });
    }
  };

  return (
    <>
      <DonateFoodNavbar link="/confirmFoodDetails" title="Delivery Options" />
      <BottomNavbar />
      <div className={styles.main}>
        <div className={styles.upper}>
          <div className={styles.img}>
            <img src={appImages.illustration} alt="Illustration" />
          </div>
          <p>Choose how this donation will reach the recipient.</p>
        </div>

        <div className={styles.button_section}>
          <button
            className={styles.selfBtn}
            disabled={submissionState.isLoading}
            onClick={() => handleSubmit("Self Delivery")}
            type="button"
          >
            Self Delivery
          </button>
          <button
            className={styles.pickupBtn}
            disabled={submissionState.isLoading}
            onClick={() => handleSubmit("Pickup")}
            type="button"
          >
            Pick-Up
          </button>
        </div>
        {submissionState.error ? <p className={styles.error}>{submissionState.error}</p> : null}
        {submissionState.isModalOpen ? (
          <div className={styles.modal_overlay}>
            <div className={styles.modal_container}>
              <IoIosCheckmarkCircle className={styles.icon} />
              <p>Your donation was posted successfully.</p>
              <p>You can track it anytime from Activity.</p>
              <Button onClick={() => history.push("/activity")} text="View Activity" />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default DeliverSelection;
