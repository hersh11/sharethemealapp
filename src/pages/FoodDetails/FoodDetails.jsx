import styles from "./foodDetails.module.css";
import BottomNavbar from "../../components/BottomNavbar";
import DonateFoodNavbar from "../../components/DonateFoodNavbar";
import Button from "../../components/Button";
import { mealOptions } from "../../constants/donation";

const FoodDetails = ({ foodData, setFoodData }) => {
  const updateField = (field, value) => {
    setFoodData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  const toggleMeal = (meal) => {
    setFoodData((currentData) => {
      const meals = currentData.meals.includes(meal)
        ? currentData.meals.filter((item) => item !== meal)
        : [...currentData.meals, meal];

      return {
        ...currentData,
        meals,
      };
    });
  };

  const canContinue = foodData.meals.length > 0 && foodData.quantity > 0;

  return (
    <>
      <BottomNavbar />
      <DonateFoodNavbar link="/category" />
      <div className={styles.main}>
        <p className={styles.heading}>Meal type</p>
        <div className={styles.radios}>
          <p>
            <input
              checked={foodData.type === "Veg"}
              onChange={() => updateField("type", "Veg")}
              value="Veg"
              type="radio"
              id="test1"
              name="type"
            />
            <label className={styles.label} htmlFor="test1">
              Veg
            </label>
          </p>
          <p>
            <input
              checked={foodData.type === "Non-veg"}
              onChange={() => updateField("type", "Non-veg")}
              value="Non-veg"
              type="radio"
              id="test2"
              name="type"
            />
            <label className={styles.label} htmlFor="test2">
              Non-veg
            </label>
          </p>
        </div>

        <div className={styles.checkboxes}>
          {mealOptions.map((meal) => (
            <div className={styles.checkbox_container} key={meal.value}>
              <input
                checked={foodData.meals.includes(meal.value)}
                onChange={() => toggleMeal(meal.value)}
                name="meals"
                type="checkbox"
                value={meal.value}
                className={styles.checkbox}
              />
              <img alt={meal.label} className={styles.overlay} src={meal.image} />
              <div className={styles.checked_overlay}></div>
              <p>{meal.label}</p>
            </div>
          ))}
        </div>

        <div className={styles.range_slider}>
          <p className={styles.heading}>Quantity (person)</p>
          <input
            value={foodData.quantity}
            onChange={(event) => updateField("quantity", Number(event.target.value))}
            type="range"
            className={styles.slider}
            min="0"
            max="60"
          />
          <div className={styles.numbers}>
            <p>0</p>
            <p>10</p>
            <p>20</p>
            <p>30</p>
            <p>40</p>
            <p>50</p>
            <p>60</p>
          </div>
        </div>

        <div className={styles.range_slider}>
          <p className={styles.heading}>When was the meal prepared (Hrs)</p>
          <input
            value={foodData.preparedHours}
            onChange={(event) =>
              updateField("preparedHours", Number(event.target.value))
            }
            type="range"
            className={styles.slider}
            min="0"
            max="12"
          />
          <div className={styles.numbers}>
            <p>0</p>
            <p>2</p>
            <p>4</p>
            <p>6</p>
            <p>8</p>
            <p>10</p>
            <p>12</p>
          </div>
        </div>

        <div className={styles.btn}>
          <Button disabled={!canContinue} text="Continue" to="/confirmFoodDetails" />
        </div>
      </div>
    </>
  );
};

export default FoodDetails;
