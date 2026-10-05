import { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import Button from "../../components/Button";
import PageHeader from "../../components/PageHeader";
import { useDonationDraft } from "../../context/contexts";
import { foodGuidelines } from "../../data/donation";
import { useBlockingStep } from "../../hooks/useBlockingStep";
import { addDays, formatHoursAgo, toDateInputValue } from "../../lib/dates";
import { MAX_DAYS_AHEAD, validateContactDetails } from "../../lib/donationFlow";
import shared from "../../styles/shared.module.css";
import styles from "./donate.module.css";
import { stepSubtitle } from "./stepSubtitle";

export default function PickupDetails() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useDonationDraft();
  const blockingPath = useBlockingStep("review");
  const [showErrors, setShowErrors] = useState(false);
  const formRef = useRef(null);

  if (blockingPath) {
    return <Navigate replace to={blockingPath} />;
  }

  const now = new Date();
  const errors = validateContactDetails(draft, now);
  const visibleErrors = showErrors ? errors : {};

  const inputProps = (name) => ({
    id: name,
    name,
    className: shared.input,
    value: draft[name],
    onChange: (event) => updateDraft({ [name]: event.target.value }),
    "aria-invalid": visibleErrors[name] ? true : undefined,
    "aria-describedby": visibleErrors[name] ? `${name}-error` : undefined,
  });

  const renderError = (name) =>
    visibleErrors[name] ? (
      <p className={shared.fieldError} id={`${name}-error`}>
        {visibleErrors[name]}
      </p>
    ) : null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const firstInvalid = Object.keys(errors)[0];

    if (firstInvalid) {
      setShowErrors(true);
      formRef.current?.elements.namedItem(firstInvalid)?.focus();
      return;
    }

    navigate("/donate/delivery");
  };

  return (
    <>
      <title>Pickup details · ShareTheMeal</title>
      <PageHeader backTo="/donate/food" subtitle={stepSubtitle(3, draft)} title="Pickup details" />
      <div className={shared.page}>
        <section aria-labelledby="summary-title" className={shared.card}>
          <div className={styles.summaryHeader}>
            <h2 className={shared.sectionTitle} id="summary-title">
              Your donation
            </h2>
            <Link className={styles.editLink} to="/donate/food">
              Edit
            </Link>
          </div>
          <dl className={styles.summary}>
            <dt>For</dt>
            <dd>{draft.recipient.name}</dd>
            <dt>Food</dt>
            <dd>
              {draft.category} · {draft.foodType}
            </dd>
            <dt>Meals</dt>
            <dd>{draft.meals.join(", ")}</dd>
            <dt>Feeds</dt>
            <dd>{draft.servings} people</dd>
            {draft.category === "Cooked Food" ? (
              <>
                <dt>Cooked</dt>
                <dd>{formatHoursAgo(draft.preparedHoursAgo)}</dd>
              </>
            ) : null}
          </dl>
        </section>

        <form className={shared.form} noValidate onSubmit={handleSubmit} ref={formRef}>
          <div className={shared.field}>
            <label className={shared.label} htmlFor="address">
              Pickup address
            </label>
            <textarea
              {...inputProps("address")}
              autoComplete="street-address"
              placeholder="Flat, building, street and area"
              rows={3}
            />
            {renderError("address")}
          </div>

          <div className={shared.field}>
            <label className={shared.label} htmlFor="phone">
              Phone number
            </label>
            <input
              {...inputProps("phone")}
              autoComplete="tel"
              inputMode="tel"
              placeholder="98765 43210"
              type="tel"
            />
            <p className={shared.hint}>The NGO or volunteer uses this to coordinate the pickup.</p>
            {renderError("phone")}
          </div>

          <fieldset>
            <legend className={styles.legend}>When is it ready?</legend>
            <div className={styles.dateTime}>
              <div className={shared.field}>
                <label className={shared.hint} htmlFor="date">
                  Date
                </label>
                <input
                  {...inputProps("date")}
                  max={toDateInputValue(addDays(now, MAX_DAYS_AHEAD))}
                  min={toDateInputValue(now)}
                  type="date"
                />
                {renderError("date")}
              </div>
              <div className={shared.field}>
                <label className={shared.hint} htmlFor="time">
                  Time
                </label>
                <input {...inputProps("time")} type="time" />
                {renderError("time")}
              </div>
            </div>
          </fieldset>

          <div className={shared.field}>
            <details className={styles.guidelines}>
              <summary>Read the food guidelines</summary>
              <ul>
                {foodGuidelines.map((guideline) => (
                  <li key={guideline}>{guideline}</li>
                ))}
              </ul>
            </details>
            <label className={styles.checkboxRow}>
              <input
                aria-describedby={visibleErrors.acceptedGuidelines ? "acceptedGuidelines-error" : undefined}
                aria-invalid={visibleErrors.acceptedGuidelines ? true : undefined}
                checked={draft.acceptedGuidelines}
                name="acceptedGuidelines"
                onChange={(event) => updateDraft({ acceptedGuidelines: event.target.checked })}
                type="checkbox"
              />
              My food follows these guidelines.
            </label>
            {renderError("acceptedGuidelines")}
          </div>

          <Button type="submit">Continue</Button>
        </form>
      </div>
    </>
  );
}
