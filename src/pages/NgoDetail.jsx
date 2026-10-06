import { useNavigate, useParams } from "react-router";
import { HiBadgeCheck } from "react-icons/hi";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import NgoStatus from "../components/NgoStatus";
import PageHeader from "../components/PageHeader";
import { useDonationDraft, useNgos } from "../context/contexts";
import { useNearbyNgos } from "../hooks/useNearbyNgos";
import { demoCampaigns } from "../data/mockData";
import { addDays, formatDay, toDateInputValue } from "../lib/dates";
import { formatDistance } from "../lib/geo";
import shared from "../styles/shared.module.css";
import styles from "./NgoDetail.module.css";

const formatCount = (value) => value.toLocaleString("en-IN");

export default function NgoDetail() {
  const { ngoId } = useParams();
  const navigate = useNavigate();
  const { status, getNgo } = useNgos();
  const { updateDraft } = useDonationDraft();
  const ngo = getNgo(ngoId);
  const { ngos: nearbyNgos } = useNearbyNgos();
  const distance = nearbyNgos.find((item) => item.id === ngoId)?.distanceKm;
  const campaigns = demoCampaigns.filter((campaign) => campaign.ngoId === ngoId);

  if (!ngo) {
    return (
      <>
        <PageHeader backTo="/ngos" title="NGO" />
        <div className={shared.page}>
          <NgoStatus />
          {status === "ready" ? (
            <>
              <p className={shared.message}>We couldn't find this NGO.</p>
              <Button to="/ngos" variant="secondary">
                Browse all NGOs
              </Button>
            </>
          ) : null}
        </div>
      </>
    );
  }

  const stats = [
    { label: "Rating", value: ngo.rating.toFixed(1) },
    { label: "Meals served", value: `${formatCount(ngo.mealsServed)}+` },
    { label: "Campaigns", value: formatCount(ngo.campaigns) },
    { label: "Volunteers", value: formatCount(ngo.volunteers) },
  ];

  const startDonation = () => {
    updateDraft({ recipient: { type: "ngo", id: ngo.id, name: ngo.name } });
    navigate("/donate/category");
  };

  return (
    <>
      <title>{`${ngo.name} · ShareTheMeal`}</title>
      <PageHeader backTo="/ngos" title={ngo.name} />
      <div className={`${shared.page} ${styles.layout}`}>
        <section className={styles.hero}>
          <Avatar art={ngo.avatar} name={ngo.name} size={104} />
          <p className={styles.verified}>
            <HiBadgeCheck aria-hidden="true" className={styles.badge} />
            Verified NGO{ngo.area ? ` · ${ngo.area}` : ""}
          </p>
          {Number.isFinite(distance) ? <p className={styles.distance}>{formatDistance(distance)} from you</p> : null}
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className={styles.side}>
          <section className={styles.need}>
            <p>
              Needs <strong>{ngo.mealsNeeded} meals</strong>
              {ngo.neededBy ? ` · ${ngo.neededBy}` : ""}
            </p>
            {ngo.accepts.length ? (
              <ul aria-label="Accepts" className={shared.chips}>
                {ngo.accepts.map((category) => (
                  <li className={shared.chip} key={category}>
                    {category}
                  </li>
                ))}
              </ul>
            ) : null}
            <Button onClick={startDonation}>Donate now</Button>
          </section>

          {ngo.about ? (
            <section aria-labelledby="about-title" className={shared.section}>
              <h2 className={shared.sectionTitle} id="about-title">
                About
              </h2>
              <p>{ngo.about}</p>
            </section>
          ) : null}

          {campaigns.length ? (
            <section aria-labelledby="campaigns-title" className={shared.section}>
              <h2 className={shared.sectionTitle} id="campaigns-title">
                Upcoming campaigns
              </h2>
              <ul className={styles.campaigns}>
                {campaigns.map((campaign) => (
                  <li className={styles.campaign} key={campaign.id}>
                    <span className={styles.campaignDate}>
                      {formatDay(toDateInputValue(addDays(new Date(), campaign.daysFromNow)))}
                    </span>
                    {campaign.title}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
}
