import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { IoIosCheckmarkCircle } from "react-icons/io";
import Button from "../../components/Button";
import PageHeader from "../../components/PageHeader";
import { useDonationDraft } from "../../context/contexts";
import {
  MAX_PREPARED_HOURS,
  MAX_SERVINGS,
  SAFE_PREPARED_HOURS,
  foodTypes,
  mealOptions,
} from "../../data/donation";
import { useBlockingStep } from "../../hooks/useBlockingStep";
import { formatHoursAgo } from "../../lib/dates";
import shared from "../../styles/shared.module.css";
import styles from "./donate.module.css";
import { stepSubtitle } from "./stepSubtitle";

const mealOrder = mealOptions.map((meal) => meal.value);

export default function FoodDetails() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useDonationDraft();
  const blockingPath = useBlockingStep("food");
  const [showErrors, setShowErrors] = useState(false);
  const mealsRef = useRef(null);

  if (blockingPath) {
    return <Navigate replace to={blockingPath} />;
  }

  const isCooked = draft.category === "Cooked Food";
  const mealsError = showErrors && draft.meals.length === 0 ? "Pick at least one meal." : "";

  const toggleMeal = (meal) => {
    updateDraft((current) => {
      const selected = current.meals.includes(meal)
        ? current.meals.filter((item) => item !== meal)
        : [...current.meals, meal];
      return { meals: mealOrder.filter((item) => selected.includes(item)) };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (draft.meals.length === 0) {
      setShowErrors(true);
      mealsRef.current?.querySelector("input")?.focus();
      return;
    }

    navigate("/donate/review");
  };

  return (
    <>
      <title>Food details · ShareTheMeal</title>
      <PageHeader backTo="/donate/category" subtitle={stepSubtitle(2, draft)} title={draft.category} />
      <div className={`${shared.page} ${shared.narrow}`}>
        <form className={shared.form} noValidate onSubmit={handleSubmit}>
          <fieldset>
            <legend className={styles.legend}>Food type</legend>
            <div className={styles.segmented}>
              {foodTypes.map((type) => (
                <div key={type}>
                  <input
                    checked={draft.foodType === type}
                    id={`food-type-${type}`}
                    name="foodType"
                    onChange={() => updateDraft({ foodType: type })}
                    type="radio"
                    value={type}
                  />
                  <label htmlFor={`food-type-${type}`}>{type}</label>
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset aria-describedby={mealsError ? "meals-error" : undefined} ref={mealsRef}>
            <legend className={styles.legend}>Good for which meals?</legend>
            <div className={styles.meals}>
              {mealOptions.map((meal) => (
                <label className={styles.meal} key={meal.value}>
                  <input
                    checked={draft.meals.includes(meal.value)}
                    name="meals"
                    onChange={() => toggleMeal(meal.value)}
                    type="checkbox"
                    value={meal.value}
                  />
                  <span className={styles.mealImage}>
                    <img alt="" height="78" src={meal.image} width="78" />
                    <IoIosCheckmarkCircle aria-hidden="true" className={styles.mealCheck} />
                  </span>
                  <span className={styles.mealLabel}>{meal.value}</span>
                </label>
              ))}
            </div>
            {mealsError ? (
              <p className={shared.fieldError} id="meals-error">
                {mealsError}
              </p>
            ) : null}
          </fieldset>

          <div className={shared.field}>
            <div className={shared.labelRow}>
              <label className={shared.label} htmlFor="servings">
                How many people can it feed?
              </label>
              <output className={shared.value} htmlFor="servings">
                {draft.servings}
              </output>
            </div>
            <input
              className={shared.range}
              id="servings"
              max={MAX_SERVINGS}
              min="1"
              onChange={(event) => updateDraft({ servings: Number(event.target.value) })}
              type="range"
              value={draft.servings}
            />
            <div aria-hidden="true" className={shared.rangeScale}>
              <span>1</span>
              <span>{MAX_SERVINGS}</span>
            </div>
          </div>

          {isCooked ? (
            <div className={shared.field}>
              <div className={shared.labelRow}>
                <label className={shared.label} htmlFor="prepared">
                  When was it cooked?
                </label>
                <output className={shared.value} htmlFor="prepared">
                  {formatHoursAgo(draft.preparedHoursAgo)}
                </output>
              </div>
              <input
                aria-valuetext={formatHoursAgo(draft.preparedHoursAgo)}
                className={shared.range}
                id="prepared"
                max={MAX_PREPARED_HOURS}
                min="0"
                onChange={(event) => updateDraft({ preparedHoursAgo: Number(event.target.value) })}
                type="range"
                value={draft.preparedHoursAgo}
              />
              <div aria-hidden="true" className={shared.rangeScale}>
                <span>Just now</span>
                <span>{MAX_PREPARED_HOURS} hours ago</span>
              </div>
              {draft.preparedHoursAgo > SAFE_PREPARED_HOURS ? (
                <p className={shared.warning}>
                  Cooked food older than {SAFE_PREPARED_HOURS} hours may be turned away. Only donate it
                  if it has been refrigerated.
                </p>
              ) : null}
            </div>
          ) : null}

          <Button type="submit">Continue</Button>
        </form>
      </div>
    </>
  );
}
