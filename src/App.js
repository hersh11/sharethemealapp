import "./App.css";

import HomePage from "./pages/HomePage";
import AllNGOS from "./pages/AllNGOS";
import NGOPage from "./pages/NGOPage";
import FoodDetails from "./pages/FoodDetails";
import CategorySelection from "./pages/CategorySelection";
import ChooseRole from "./pages/ChooseYourRole";
import DeliverSelection from "./pages/DeliverSelection";
import DonationSelection from "./pages/DonationSelection";
import Profile from "./pages/Profile/Profile";
import Signup from "./pages/Signup";
import FirstPage from "./pages/FirstPage";
import { Switch, Route } from "react-router-dom";
import ConfirmFoodDetails from "./pages/ConfirmFoodDetails";
import { useState, useEffect } from "react";
import { initialFoodDonationForm } from "./constants/donation";
import { initialDonationContactForm } from "./constants/donation";
import { useAuth } from "./hooks/useAuth";
import { useNgoData } from "./hooks/useNgoData";
import { useDonations } from "./hooks/useDonations";
import Activity from "./pages/Activity";

function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [foodData, setFoodData] = useState(initialFoodDonationForm);
  const [donationContact, setDonationContact] = useState(initialDonationContactForm);
  const { isLoading: isUserLoading, user, logout, loginWithGoogle } = useAuth();
  const { ngos, isLoading: isNgoLoading, error: ngoError } = useNgoData();
  const {
    donations,
    isLoading: isDonationsLoading,
    error: donationsError,
    createDonation,
  } = useDonations();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSplashVisible(false);
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (isUserLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <div className="App">
        {isSplashVisible ? <FirstPage /> : <Signup onGoogleLogin={loginWithGoogle} />}
      </div>
    );
  }

  return (
    <div className="App">
      <Switch>
        <Route exact path="/profile">
          <Profile donations={donations} user={user} logout={logout} />
        </Route>

        <Route exact path="/activity">
          <Activity donations={donations} error={donationsError} isLoading={isDonationsLoading} />
        </Route>

        <Route exact path="/">
          <HomePage data={ngos} error={ngoError} isLoading={isNgoLoading} />
        </Route>

        <Route path="/category" exact>
          <CategorySelection
            setFoodData={setFoodData}
          />
        </Route>

        <Route path="/all" exact>
          <AllNGOS data={ngos} error={ngoError} isLoading={isNgoLoading} />
        </Route>

        <Route path="/all/:id" exact>
          <NGOPage data={ngos} setDonationContact={setDonationContact} />
        </Route>

        <Route path="/foodDetails" exact>
          <FoodDetails foodData={foodData} setFoodData={setFoodData} />
        </Route>

        <Route path="/delivery" exact>
          <DeliverSelection
            createDonation={createDonation}
            donationContact={donationContact}
            foodData={foodData}
            resetDonationFlow={() => {
              setFoodData(initialFoodDonationForm);
              setDonationContact(initialDonationContactForm);
            }}
          />
        </Route>

        <Route path="/chooseRole" exact>
          <ChooseRole />
        </Route>

        <Route path="/donationType" exact>
          <DonationSelection />
        </Route>

        <Route path="/confirmFoodDetails" exact>
          <ConfirmFoodDetails
            donationContact={donationContact}
            foodData={foodData}
            setDonationContact={setDonationContact}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
