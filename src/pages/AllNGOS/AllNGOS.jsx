import DonateFoodNavbar from "../../components/DonateFoodNavbar";
import NGOCard from "../../components/NGOCard";
import BottomNavbar from "../../components/BottomNavbar";
import { Link } from "react-router-dom";
import styles from "./allNgos.module.css";

const AllNGOS = ({ data = [] }) => {
  const ngos = data.filter(Boolean);

  return (
    <>
      <BottomNavbar />
      <DonateFoodNavbar link="/" />
      <div className={styles.main}>
        <h2 className={styles.headline}>Choose where you want to donate</h2>
        <div className={styles.list}>
          {ngos.map((ngo) => (
            <Link key={ngo.id} to={`/all/${ngo.id}`}>
              <NGOCard data={ngo} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllNGOS;
