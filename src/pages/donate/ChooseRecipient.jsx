import { useNavigate } from "react-router";
import Button from "../../components/Button";
import ImageOption from "../../components/ImageOption";
import PageHeader from "../../components/PageHeader";
import { useDonationDraft } from "../../context/contexts";
import { HUNGER_SPOT_RECIPIENT, recipientOptions } from "../../data/donation";
import { getBlockingStepPath } from "../../lib/donationFlow";
import shared from "../../styles/shared.module.css";
import styles from "./donate.module.css";

export default function ChooseRecipient() {
  const navigate = useNavigate();
  const { draft, updateDraft, resetDraft } = useDonationDraft();
  const hasProgress = Boolean(draft.recipient && draft.category);
  const resumePath = getBlockingStepPath(draft, "delivery") ?? "/donate/delivery";

  const choose = (optionId) => {
    if (optionId === "ngo") {
      navigate("/ngos");
      return;
    }

    updateDraft({ recipient: HUNGER_SPOT_RECIPIENT });
    navigate("/donate/category");
  };

  return (
    <>
      <title>Donate food · ShareTheMeal</title>
      <PageHeader backTo="/" title="Donate food" />
      <div className={shared.page}>
        {hasProgress ? (
          <section aria-label="Donation in progress" className={styles.resume}>
            <p>
              You have an unfinished donation for <strong>{draft.recipient.name}</strong>.
            </p>
            <div className={styles.resumeActions}>
              <Button size="small" to={resumePath}>
                Continue
              </Button>
              <Button onClick={resetDraft} size="small" variant="secondary">
                Start over
              </Button>
            </div>
          </section>
        ) : null}

        <p className={shared.intro}>Where should your food go?</p>
        <ul className={shared.list}>
          {recipientOptions.map((option) => (
            <li key={option.id}>
              <ImageOption
                description={option.description}
                image={option.image}
                onClick={() => choose(option.id)}
                title={option.label}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
