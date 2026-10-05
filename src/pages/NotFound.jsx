import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import shared from "../styles/shared.module.css";

export default function NotFound() {
  return (
    <>
      <title>Page not found · ShareTheMeal</title>
      <PageHeader backTo="/" title="Page not found" />
      <div className={shared.page}>
        <p className={shared.message}>We couldn't find that page. It may have moved.</p>
        <Button to="/">Go to home</Button>
      </div>
    </>
  );
}
