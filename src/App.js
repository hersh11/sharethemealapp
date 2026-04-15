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
import { useAuth } from "./hooks/useAuth";
import { useNgoData } from "./hooks/useNgoData";

function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [foodData, setFoodData] = useState(initialFoodDonationForm);
  const { isLoading: isUserLoading, user, logout, loginWithGoogle } = useAuth();
  const { ngos } = useNgoData();

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
          <Profile user={user} logout={logout} />
        </Route>

        <Route exact path="/">
          <HomePage data={ngos} />
        </Route>

        <Route path="/category" exact>
          <CategorySelection />
        </Route>

        <Route path="/all" exact>
          <AllNGOS data={ngos} />
        </Route>

        <Route path="/all/:id" exact>
          <NGOPage data={ngos} />
        </Route>

        <Route path="/foodDetails" exact>
          <FoodDetails foodData={foodData} setFoodData={setFoodData} />
        </Route>

        <Route path="/delivery" exact>
          <DeliverSelection />
        </Route>

        <Route path="/chooseRole" exact>
          <ChooseRole />
        </Route>

        <Route path="/donationType" exact>
          <DonationSelection />
        </Route>

        <Route path="/confirmFoodDetails" exact>
          <ConfirmFoodDetails foodData={foodData} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
