import { useState } from "react";
import { Navigate } from "react-router";
import Button from "../../components/Button";
import PageHeader from "../../components/PageHeader";
import { useDonationDraft, useDonations } from "../../context/contexts";
import { deliveryModes } from "../../data/donation";
import { images } from "../../data/images";
import { useBlockingStep } from "../../hooks/useBlockingStep";
import { formatDay, formatTime } from "../../lib/dates";
import shared from "../../styles/shared.module.css";
import styles from "./donate.module.css";
import { stepSubtitle } from "./stepSubtitle";

export default function DeliveryOptions() {
  const { draft, updateDraft, resetDraft } = useDonationDraft();
  const { addDonation } = useDonations();
  const blockingPath = useBlockingStep("delivery");
  const [postedId, setPostedId] = useState(null);

  // Checked before the step guard: posting clears the draft, which would
  // otherwise bounce the user back to the start of the flow.
  if (postedId) {
    return <Navigate replace state={{ postedId }} to="/activity" />;
  }

  if (blockingPath) {
    return <Navigate replace to={blockingPath} />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const donation = addDonation(draft);
    resetDraft();
    setPostedId(donation.id);
  };

  return (
    <>
      <title>Delivery · ShareTheMeal</title>
      <PageHeader backTo="/donate/review" subtitle={stepSubtitle(4, draft)} title="Delivery" />
      <div className={shared.page}>
        <img alt="" className={styles.illustration} height="205" src={images.deliveryScooter} width="414" />
        <form className={shared.form} onSubmit={handleSubmit}>
          <fieldset>
            <legend className={styles.legend}>How should the food get there?</legend>
            <div className={styles.choices}>
              {deliveryModes.map((mode) => (
                <label className={styles.choice} key={mode.value}>
                  <input
                    checked={draft.deliveryMode === mode.value}
                    name="deliveryMode"
                    onChange={() => updateDraft({ deliveryMode: mode.value })}
                    type="radio"
                    value={mode.value}
                  />
                  <span>
                    <span className={styles.choiceTitle}>{mode.title}</span>
                    <span className={styles.choiceDescription}>{mode.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className={styles.recap}>
            Food for {draft.servings} people, ready {formatDay(draft.date)} at {formatTime(draft.time)}
          </p>
          <Button type="submit">Post donation</Button>
        </form>
      </div>
    </>
  );
}
