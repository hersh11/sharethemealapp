import BottomNavbar from "../../components/BottomNavbar";
import styles from "./categorySelection.module.css";
import DonateFoodNavbar from "../../components/DonateFoodNavbar";
import { Link } from "react-router-dom";
import { categoryOptions } from "../../constants/donation";

const CategorySelection = ({ setFoodData }) => {
  return (
    <>
      <DonateFoodNavbar link="/donationType" />
      <BottomNavbar />

      <div className={styles.main}>
        <h1>Select the Category</h1>
        <div className={styles.image_section}>
          {categoryOptions.map((option) => (
            <Link
              key={option.label}
              onClick={() =>
                setFoodData((currentData) => ({
                  ...currentData,
                  category: option.label,
                }))
              }
              to={option.to}
            >
              <img alt={option.label} src={option.image} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategorySelection;
