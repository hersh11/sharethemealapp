import { useState } from "react";
import { Link } from "react-router";
import { BiSearch } from "react-icons/bi";
import { RiArrowRightSLine } from "react-icons/ri";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import NgoCard from "../components/NgoCard";
import NgoStatus from "../components/NgoStatus";
import { useAuth, useNgos } from "../context/contexts";
import { demoCampaigns } from "../data/mockData";
import { addDays, formatDay, toDateInputValue } from "../lib/dates";
import shared from "../styles/shared.module.css";
import styles from "./Home.module.css";

const SeeAll = () => (
  <Link className={shared.seeAll} to="/ngos">
    See all <RiArrowRightSLine aria-hidden="true" />
  </Link>
);

export default function Home() {
  const { user } = useAuth();
  const { ngos, getNgo } = useNgos();
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? ngos.filter((ngo) => `${ngo.name} ${ngo.area}`.toLowerCase().includes(normalizedQuery))
    : [];
  const mostNeeded = [...ngos].sort((a, b) => b.mealsNeeded - a.mealsNeeded).slice(0, 3);
  const campaigns = demoCampaigns
    .map((campaign) => ({ ...campaign, ngo: getNgo(campaign.ngoId) }))
    .filter((campaign) => campaign.ngo);
  const firstName = user.name?.split(" ")[0] || "there";

  return (
    <>
      <title>Home · ShareTheMeal</title>
      <header className={styles.header}>
        <h1 className={styles.greeting}>Hi, {firstName}</h1>
        <p className={styles.subtitle}>Who are you feeding today?</p>
        <div className={styles.search}>
          <BiSearch aria-hidden="true" className={styles.searchIcon} />
          <label className="visually-hidden" htmlFor="ngo-search">
            Search NGOs
          </label>
          <input
            className={styles.searchInput}
            id="ngo-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search NGOs or areas"
            type="search"
            value={query}
          />
        </div>
      </header>

      <div className={shared.page}>
        <NgoStatus />

        {normalizedQuery ? (
          <section aria-labelledby="results-title" className={shared.section}>
            <h2 className={shared.sectionTitle} id="results-title">
              Results for “{query.trim()}”
            </h2>
            {results.length ? (
              <ul className={shared.list}>
                {results.map((ngo) => (
                  <li key={ngo.id}>
                    <NgoCard ngo={ngo} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className={shared.message}>No NGOs match your search.</p>
            )}
          </section>
        ) : (
          <>
            <section className={styles.cta}>
              <h2 className={styles.ctaTitle}>Have extra food?</h2>
              <p>Post it in under a minute and a nearby NGO will collect it.</p>
              <Button className={styles.ctaButton} to="/donate" variant="secondary">
                Donate food
              </Button>
            </section>

            {ngos.length ? (
              <section aria-labelledby="nearby-title" className={shared.section}>
                <div className={shared.sectionHeader}>
                  <h2 className={shared.sectionTitle} id="nearby-title">
                    NGOs near you
                  </h2>
                  <SeeAll />
                </div>
                <ul className={styles.carousel}>
                  {ngos.map((ngo) => (
                    <li key={ngo.id}>
                      <Link className={styles.nearbyNgo} to={`/ngos/${ngo.id}`}>
                        <Avatar name={ngo.name} size={64} />
                        <span>{ngo.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {mostNeeded.length ? (
              <section aria-labelledby="needed-title" className={shared.section}>
                <div className={shared.sectionHeader}>
                  <h2 className={shared.sectionTitle} id="needed-title">
                    Most food needed
                  </h2>
                  <SeeAll />
                </div>
                <ul className={shared.list}>
                  {mostNeeded.map((ngo) => (
                    <li key={ngo.id}>
                      <NgoCard ngo={ngo} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {campaigns.length ? (
              <section aria-labelledby="campaigns-title" className={shared.section}>
                <h2 className={shared.sectionTitle} id="campaigns-title">
                  Upcoming campaigns
                </h2>
                <ul className={styles.carousel}>
                  {campaigns.map((campaign) => (
                    <li key={campaign.id}>
                      <Link className={styles.campaign} to={`/ngos/${campaign.ngo.id}`}>
                        <span className={styles.campaignDate}>
                          {formatDay(toDateInputValue(addDays(new Date(), campaign.daysFromNow)))}
                        </span>
                        <span className={styles.campaignTitle}>{campaign.title}</span>
                        <span className={styles.campaignNgo}>{campaign.ngo.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
