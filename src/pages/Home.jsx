import { useState } from "react";
import { Link } from "react-router";
import { BiDonateHeart, BiSearch } from "react-icons/bi";
import { RiArrowRightSLine, RiCloseLine, RiMapPin2Line, RiTimeLine } from "react-icons/ri";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import LocationControl from "../components/LocationControl";
import Logo from "../components/Logo";
import NgoCard from "../components/NgoCard";
import NgoStatus from "../components/NgoStatus";
import { useAuth, useNgos } from "../context/contexts";
import { demoCampaigns } from "../data/mockData";
import { useNearbyNgos } from "../hooks/useNearbyNgos";
import { addDays, formatDay, toDateInputValue } from "../lib/dates";
import { formatDistance } from "../lib/geo";
import { localStore, STORAGE_KEYS } from "../lib/storage";
import { isDemoMode } from "../services/api";
import shared from "../styles/shared.module.css";
import styles from "./Home.module.css";

const highlights = [
  { icon: RiMapPin2Line, text: "Find NGOs and hunger spots that need meals today" },
  { icon: BiDonateHeart, text: "Post a donation in under a minute" },
  { icon: RiTimeLine, text: "Choose pickup or drop-off and track every donation" },
];

const SeeAll = () => (
  <Link className={shared.seeAll} to="/ngos">
    See all <RiArrowRightSLine aria-hidden="true" />
  </Link>
);

export default function Home() {
  const { user } = useAuth();
  const { ngos: allNgos, getNgo } = useNgos();
  const { ngos: nearbyNgos, location } = useNearbyNgos();
  const [query, setQuery] = useState("");
  const [showWelcome, setShowWelcome] = useState(() => !localStore.get(STORAGE_KEYS.welcomeDismissed, false));

  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? nearbyNgos.filter((ngo) => `${ngo.name} ${ngo.area}`.toLowerCase().includes(normalizedQuery))
    : [];
  const mostNeeded = [...allNgos].sort((a, b) => b.mealsNeeded - a.mealsNeeded).slice(0, 3);
  const campaigns = demoCampaigns
    .map((campaign) => ({ ...campaign, ngo: getNgo(campaign.ngoId) }))
    .filter((campaign) => campaign.ngo);
  const firstName = user.name?.split(" ")[0] || "there";
  const isSorted = location.status === "ready";

  const dismissWelcome = () => {
    localStore.set(STORAGE_KEYS.welcomeDismissed, true);
    setShowWelcome(false);
  };

  return (
    <>
      <title>ShareTheMeal · Donate surplus food to NGOs nearby</title>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Logo className={styles.mobileLogo} size={30} />
          <div>
            <h1 className={styles.greeting}>Hi, {firstName}</h1>
            <p className={styles.subtitle}>Who are you feeding today?</p>
          </div>
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
              <ul className={shared.cardGrid}>
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
            {showWelcome ? (
              <section aria-labelledby="welcome-title" className={styles.welcome}>
                <button aria-label="Dismiss welcome" className={styles.dismiss} onClick={dismissWelcome} type="button">
                  <RiCloseLine aria-hidden="true" />
                </button>
                <div className={styles.welcomeCopy}>
                  <h2 className={styles.welcomeTitle} id="welcome-title">
                    Share surplus food with people who need it
                  </h2>
                  <ul className={styles.highlights}>
                    {highlights.map(({ icon: Icon, text }) => (
                      <li key={text}>
                        <Icon aria-hidden="true" />
                        {text}
                      </li>
                    ))}
                  </ul>
                  <div className={styles.welcomeActions}>
                    <Button className={styles.welcomePrimary} to="/donate" variant="secondary">
                      Donate food
                    </Button>
                    <Button className={styles.welcomeGhost} to="/ngos">
                      Browse NGOs
                    </Button>
                  </div>
                  {isDemoMode ? (
                    <p className={styles.demoNote}>
                      This is a demo: the NGOs are fictional and nothing you enter leaves your browser.
                    </p>
                  ) : null}
                </div>
                <div aria-hidden="true" className={styles.welcomeArt}>
                  {allNgos.slice(0, 4).map((ngo, index) => (
                    <span className={styles.floatingAvatar} key={ngo.id} style={{ "--i": index }}>
                      <Avatar art={ngo.avatar} name={ngo.name} size={64} />
                    </span>
                  ))}
                </div>
              </section>
            ) : (
              <section className={styles.cta}>
                <h2 className={styles.ctaTitle}>Have extra food?</h2>
                <p>Post it in under a minute and a nearby NGO will collect it.</p>
                <Button className={styles.ctaButton} to="/donate" variant="secondary">
                  Donate food
                </Button>
              </section>
            )}

            {nearbyNgos.length ? (
              <section aria-labelledby="nearby-title" className={shared.section}>
                <div className={shared.sectionHeader}>
                  <h2 className={shared.sectionTitle} id="nearby-title">
                    {isSorted ? "NGOs near you" : "Explore NGOs"}
                  </h2>
                  <SeeAll />
                </div>
                <LocationControl location={location} nearest={nearbyNgos[0]} />
                <ul className={styles.nearby}>
                  {nearbyNgos.map((ngo) => (
                    <li key={ngo.id}>
                      <Link className={styles.nearbyNgo} to={`/ngos/${ngo.id}`}>
                        <Avatar art={ngo.avatar} name={ngo.name} size={60} />
                        <span className={styles.nearbyName}>{ngo.name}</span>
                        <span className={styles.nearbyMeta}>
                          {Number.isFinite(ngo.distanceKm) ? `${formatDistance(ngo.distanceKm)} away` : ngo.area}
                        </span>
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
                <ul className={shared.cardGrid}>
                  {mostNeeded.map((ngo) => (
                    <li key={ngo.id}>
                      <NgoCard ngo={nearbyNgos.find((item) => item.id === ngo.id) ?? ngo} />
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
                <ul className={styles.campaigns}>
                  {campaigns.map((campaign) => (
                    <li key={campaign.id}>
                      <Link className={styles.campaign} to={`/ngos/${campaign.ngo.id}`}>
                        <span className={styles.campaignDate}>
                          {formatDay(toDateInputValue(addDays(new Date(), campaign.daysFromNow)))}
                        </span>
                        <span className={styles.campaignTitle}>{campaign.title}</span>
                        <span className={styles.campaignNgo}>
                          <Avatar art={campaign.ngo.avatar} name={campaign.ngo.name} size={22} />
                          {campaign.ngo.name}
                        </span>
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
