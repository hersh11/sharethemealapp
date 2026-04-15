import styles from "./chooseRole.module.css";
import { roleOptions } from "../../constants/donation";

const ChooseRole = () => {
  return (
    <>
      <div className={styles.main}>
        <h2>Choose your role</h2>
        {roleOptions.map((role) => (
          <div
            className={[
              styles.role_section,
              role.isActive ? "" : styles.role_section_inactive,
            ]
              .join(" ")
              .trim()}
            key={role.title}
          >
            <div className={styles.info}>
              <h1>{role.title}</h1>
              <p>{role.description}</p>
            </div>
            <div className={styles.img}>
              <img alt={role.title} src={role.image} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChooseRole;
