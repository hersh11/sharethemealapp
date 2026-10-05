import { useNgos } from "../context/contexts";
import shared from "../styles/shared.module.css";
import Button from "./Button";

// Loading and error states for anything that depends on the NGO list.
export default function NgoStatus() {
  const { status, error, reload } = useNgos();

  if (status === "loading") {
    return (
      <p className={shared.message} role="status">
        Loading NGOs…
      </p>
    );
  }

  if (status === "error") {
    return (
      <div className={shared.errorBox} role="alert">
        <span>{error}</span>
        <Button onClick={reload} size="small" variant="danger">
          Try again
        </Button>
      </div>
    );
  }

  return null;
}
