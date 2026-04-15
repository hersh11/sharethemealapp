import styles from "./confirmFoodDetails.module.css";
import BottomNavbar from "../../components/BottomNavbar";
import DonateFoodNavbar from "../../components/DonateFoodNavbar";
import { GoLocation } from "react-icons/go";
import { BsTelephone } from "react-icons/bs";
import Button from "../../components/Button";
import { useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

const ConfirmFoodDetails = ({ foodData }) => {
  const history = useHistory();
  const [formValues, setFormValues] = useState({
    location: "",
    phone: "",
    date: "",
    time: "",
    acceptedGuidelines: false,
  });

  const updateField = (field, value) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const summary = useMemo(
    () => ({
      mealText: foodData.meals.length ? foodData.meals.join(", ") : "No meals selected",
      quantityText: `${foodData.quantity} servings`,
      prepTimeText: `${foodData.preparedHours} hrs ago`,
    }),
    [foodData]
  );

  const canSubmit =
    formValues.location.trim() &&
    formValues.phone.trim() &&
    formValues.date &&
    formValues.time &&
    formValues.acceptedGuidelines;

  return (
    <>
      <DonateFoodNavbar link="/foodDetails" />
      <BottomNavbar />
      <div className={styles.main}>
        <p className={styles.heading}>Confirm food details</p>
        <div className={styles.top_section}>
          <div className={styles.left}>
            <p>{foodData.type}</p>
            <p>{summary.mealText}</p>
            <p>{summary.quantityText}</p>
            <p>{summary.prepTimeText}</p>
          </div>
          <div className={styles.right}>
            <img
              src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
              alt="Prepared food"
            />
          </div>
        </div>

        <p className={styles.heading}>Pickup Location</p>
        <div className={styles.input_box}>
          <GoLocation />
          <input
            type="text"
            value={formValues.location}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="Sector 15, MIDC Road, Spine City, Pune"
          />
        </div>

        <p className={styles.heading}>Contact Information</p>
        <div className={styles.input_box}>
          <BsTelephone />
          <input
            type="tel"
            value={formValues.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="9876383735"
          />
        </div>

        <p className={styles.heading}>By when you can donate</p>
        <div className={styles.input_box}>
          <input
            type="date"
            value={formValues.date}
            onChange={(event) => updateField("date", event.target.value)}
          />
        </div>

        <div className={[styles.input_box, styles.bottom_input].join(" ")}>
          <input
            type="time"
            value={formValues.time}
            onChange={(event) => updateField("time", event.target.value)}
          />
        </div>

        <div className={styles.guideline}>
          <input
            checked={formValues.acceptedGuidelines}
            id="guidelines"
            onChange={(event) =>
              updateField("acceptedGuidelines", event.target.checked)
            }
            type="checkbox"
          />
          <label htmlFor="guidelines">
            All food donated should follow the guidelines.
          </label>
        </div>
        <div className={styles.btn}>
          <Button
            disabled={!canSubmit}
            onClick={() => history.push("/delivery")}
            text="Post"
          />
        </div>
      </div>
    </>
  );
};

export default ConfirmFoodDetails;
