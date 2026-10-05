import { Component } from "react";
import Button from "./Button";
import FullPageMessage from "./FullPageMessage";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <FullPageMessage role="alert" title="Something went wrong">
          <p>Reload the page to try again. Your saved donations are safe.</p>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </FullPageMessage>
      );
    }

    return this.props.children;
  }
}
