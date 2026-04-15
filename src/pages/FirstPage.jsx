import styles from "./FirstPage.module.css";
import { appImages } from "../constants/assets";

const FirstPage = () => {
  return (
    <div className={styles.wrapper}>
      <img alt="Share The Meal logo" className={styles.logo} src={appImages.logo} />
    </div>
  );
};

export default FirstPage;
