import styles from "./homePage.module.css";
import { BiSearch } from "react-icons/bi";
import { RiArrowRightSLine } from "react-icons/ri";
import NGOCard from "../../components/NGOCard";
import BottomNavbar from "../../components/BottomNavbar";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { campaignImages } from "../../constants/assets";

const HomePage = ({ data = [], isLoading, error }) => {
  const [query, setQuery] = useState("");

  const filteredNgos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return data;
    }

    return data.filter((ngo) =>
      ngo.NGOName?.toLowerCase().includes(normalizedQuery)
    );
  }, [data, query]);

  const featuredNgos = filteredNgos.slice(0, 3);
  const nearbyNgos = filteredNgos.slice(0, 2);

  return (
    <>
      <BottomNavbar />
      <div className={styles.main}>
        <div className={styles.main_top}>
          <div className={styles.search_input}>
            <BiSearch className={styles.search_icon} />
            <input
              className={styles.input}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              placeholder="Search for NGO or campaign"
            />
          </div>
        </div>

        <div className={styles.volunteer_images}>
          <div className={styles.top}>
            <h3>Volunteer Required</h3>
            <Link to="/all">
              <div className={styles.see_all}>
                <p>See all</p>
                <RiArrowRightSLine className={styles.search_icon} />
              </div>
            </Link>
          </div>
          <div className={styles.round_images}>
            {isLoading ? <p>Loading NGOs...</p> : null}
            {!isLoading && error ? <p>{error}</p> : null}
            {filteredNgos.map((ngo) => (
              <Link key={ngo.id} to={`/all/${ngo.id}`}>
                <img
                  className={styles.round_image}
                  src={ngo.image}
                  alt={ngo.NGOName}
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.food_required_section}>
          <div className={styles.food_required_top}>
            <h3>Food Required</h3>
            <Link to="/all">
              <div className={styles.see_all}>
                <p>See all</p>
                <RiArrowRightSLine className={styles.search_icon} />
              </div>
            </Link>
          </div>
          {featuredNgos.map((ngo) => (
            <Link key={ngo.id} to={`/all/${ngo.id}`}>
              <NGOCard data={ngo} />
            </Link>
          ))}
          {!isLoading && !error && featuredNgos.length === 0 ? (
            <p>No NGOs match your search yet.</p>
          ) : null}
        </div>
        <div className={styles.upcoming_campaigns}>
          <div className={styles.top}>
            <h3>Upcoming Campaigns</h3>
            <div className={styles.see_all}>
              <p>See all</p>
              <RiArrowRightSLine className={styles.search_icon} />
            </div>
          </div>
          <div className={styles.round_images}>
            {campaignImages.map((image) => (
              <img
                key={image}
                className={styles.campaign_image}
                src={image}
                alt="Food donation campaign"
                loading="lazy"
              />
            ))}
          </div>
        </div>

        <div className={styles.food_required_section}>
          <div className={styles.food_required_top}>
            <h3>Nearby NGO</h3>
            <Link to="/all">
              <div className={styles.see_all}>
                <p>See all</p>
                <RiArrowRightSLine className={styles.search_icon} />
              </div>
            </Link>
          </div>
          <div className={styles.nearby_images}>
            {nearbyNgos.map((ngo) => (
              <Link key={ngo.id} to={`/all/${ngo.id}`}>
                <img
                  className={styles.nearby_image}
                  src={ngo.image}
                  alt={ngo.NGOName}
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
