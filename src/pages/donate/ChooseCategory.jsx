import { Navigate, useNavigate } from "react-router";
import ImageOption from "../../components/ImageOption";
import PageHeader from "../../components/PageHeader";
import { useDonationDraft, useNgos } from "../../context/contexts";
import { categoryOptions } from "../../data/donation";
import { useBlockingStep } from "../../hooks/useBlockingStep";
import shared from "../../styles/shared.module.css";
import { stepSubtitle } from "./stepSubtitle";

export default function ChooseCategory() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useDonationDraft();
  const { getNgo } = useNgos();
  const blockingPath = useBlockingStep("category");

  if (blockingPath) {
    return <Navigate replace to={blockingPath} />;
  }

  const { recipient } = draft;
  const ngo = recipient.type === "ngo" ? getNgo(recipient.id) : null;
  const backTo = ngo ? `/ngos/${ngo.id}` : "/donate";

  const describe = (option) =>
    ngo?.accepts.length && !ngo.accepts.includes(option.value)
      ? `${ngo.name} doesn't usually take this.`
      : option.description;

  const choose = (category) => {
    updateDraft({ category });
    navigate("/donate/food");
  };

  return (
    <>
      <title>Choose a category · ShareTheMeal</title>
      <PageHeader backTo={backTo} subtitle={stepSubtitle(1, draft)} title="What are you donating?" />
      <div className={shared.page}>
        <ul className={shared.list}>
          {categoryOptions.map((option) => (
            <li key={option.value}>
              <ImageOption
                description={describe(option)}
                image={option.image}
                onClick={() => choose(option.value)}
                selected={draft.category === option.value}
                title={option.value}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
