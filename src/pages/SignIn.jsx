import { BiDonateHeart } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { RiMapPin2Line, RiTimeLine } from "react-icons/ri";
import Button from "../components/Button";
import { useAuth } from "../context/contexts";
import { images } from "../data/images";
import { isDemoMode } from "../services/api";
import styles from "./SignIn.module.css";

const highlights = [
  { icon: RiMapPin2Line, text: "Find NGOs and hunger spots that need meals today" },
  { icon: BiDonateHeart, text: "Post a donation in under a minute" },
  { icon: RiTimeLine, text: "Choose pickup or drop-off and track every donation" },
];

export default function SignIn() {
  const { signIn } = useAuth();

  return (
    <div className={styles.page}>
      <title>ShareTheMeal · Donate surplus food to NGOs nearby</title>
      <img alt="Share The Meal" className={styles.logo} height="162" src={images.logo} width="497" />

      <div className={styles.copy}>
        <h1 className={styles.title}>Share surplus food with people who need it</h1>
        <ul className={styles.highlights}>
          {highlights.map(({ icon: Icon, text }) => (
            <li key={text}>
              <Icon aria-hidden="true" className={styles.icon} />
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        {isDemoMode ? (
          <>
            <Button onClick={signIn}>Try the demo</Button>
            <p className={styles.note}>No account needed. Demo data stays in this browser.</p>
          </>
        ) : (
          <Button onClick={signIn} variant="secondary">
            <FcGoogle aria-hidden="true" className={styles.google} />
            Continue with Google
          </Button>
        )}
      </div>
    </div>
  );
}
