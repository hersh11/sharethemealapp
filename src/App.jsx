import { Route, Routes } from "react-router";
import AppLayout from "./components/AppLayout";
import AuthGate from "./components/AuthGate";
import ErrorBoundary from "./components/ErrorBoundary";
import AppProviders from "./context/AppProviders";
import Activity from "./pages/Activity";
import ChooseCategory from "./pages/donate/ChooseCategory";
import ChooseRecipient from "./pages/donate/ChooseRecipient";
import DeliveryOptions from "./pages/donate/DeliveryOptions";
import FoodDetails from "./pages/donate/FoodDetails";
import PickupDetails from "./pages/donate/PickupDetails";
import Home from "./pages/Home";
import NgoDetail from "./pages/NgoDetail";
import NgoList from "./pages/NgoList";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <Routes>
          <Route element={<AuthGate />}>
            <Route element={<AppLayout />}>
              <Route element={<Home />} index />
              <Route element={<NgoList />} path="ngos" />
              <Route element={<NgoDetail />} path="ngos/:ngoId" />
              <Route path="donate">
                <Route element={<ChooseRecipient />} index />
                <Route element={<ChooseCategory />} path="category" />
                <Route element={<FoodDetails />} path="food" />
                <Route element={<PickupDetails />} path="review" />
                <Route element={<DeliveryOptions />} path="delivery" />
              </Route>
              <Route element={<Activity />} path="activity" />
              <Route element={<Profile />} path="profile" />
              <Route element={<NotFound />} path="*" />
            </Route>
          </Route>
        </Routes>
      </AppProviders>
    </ErrorBoundary>
  );
}
