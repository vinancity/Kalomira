//import React from "react";
import { lazy, Suspense } from "react";
import { IonApp, IonPage, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, BrowserRouter as Router } from "react-router-dom";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/styles.css";

// import Home from "views/Home";
import Dashboard from "views/Dashboard";
// import MintAndRedeem from "views/MintAndRedeem";
// import Farms from "views/Farms";
import Loading from "views/Loading";
// import NotFound from "views/NotFound";

import Navbar from "components/Navbar/Navbar";
import Footer from "components/Footer/Footer";

const Home = lazy(() => import("views/Home"));
const MintAndRedeem = lazy(() => import("views/MintAndRedeem"));
const Farms = lazy(() => import("views/Farms"));
const NotFound = lazy(() => import("views/NotFound"));

export default function App() {
  return (
    <IonApp>
      <IonPage className="ion-page" id="main-content">
        <IonReactRouter>
          <Navbar />
          <Suspense fallback={<Loading />}>
            <Route exact path="/">
              <Redirect to="/dashboard" />
            </Route>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/dashboard">
              <Dashboard />
            </Route>
            <Route exact path="/trade">
              <Loading />
            </Route>
            <Route exact path="/mintredeem">
              <MintAndRedeem />
            </Route>
            <Route exact path="/liquidity">
              <NotFound />
            </Route>
            <Route exact path="/farms">
              <Farms />
            </Route>
            <Route exact path="/pools">
              <NotFound />
            </Route>
            <Route exact path="/treasury">
              <NotFound />
            </Route>
            <Route exact path="/more">
              <NotFound />
            </Route>
          </Suspense>
          <Footer />
        </IonReactRouter>
      </IonPage>
    </IonApp>
  );
}
