import NgoCard from "../components/NgoCard";
import NgoStatus from "../components/NgoStatus";
import PageHeader from "../components/PageHeader";
import { useNgos } from "../context/contexts";
import shared from "../styles/shared.module.css";

export default function NgoList() {
  const { ngos, status } = useNgos();

  return (
    <>
      <title>NGOs · ShareTheMeal</title>
      <PageHeader backTo="/" title="NGOs" />
      <div className={shared.page}>
        <p className={shared.intro}>Pick an NGO to see what they need and donate to them.</p>
        <NgoStatus />
        {ngos.length ? (
          <ul className={shared.list}>
            {ngos.map((ngo) => (
              <li key={ngo.id}>
                <NgoCard headingLevel={2} ngo={ngo} />
              </li>
            ))}
          </ul>
        ) : null}
        {status === "ready" && !ngos.length ? (
          <p className={shared.message}>No NGOs are available right now.</p>
        ) : null}
      </div>
    </>
  );
}
