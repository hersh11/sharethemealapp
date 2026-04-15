import styles from "./signup.module.css";
import { BsFacebook } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

const Signup = ({ onGoogleLogin }) => {
  return (
    <div className={styles.main}>
      <h1>Welcome back</h1>
      <p className={styles.signUpWith}>
        Sign in to browse NGOs, post food donations, and manage pickups.
      </p>

      <div className={styles.or}>
        <div className={styles.number}>
          <p>Continue with</p>
        </div>
      </div>

      <div className={styles.lower}>
        <button className={styles.google} onClick={onGoogleLogin} type="button">
          <FcGoogle className={styles.iconGoogle} />
          <p>Login with Google</p>
        </button>
        <button className={styles.google} disabled type="button">
          <BsFacebook className={styles.iconFb} />
          <p>Facebook login coming soon</p>
        </button>
      </div>
    </div>
  );
};

export default Signup;
