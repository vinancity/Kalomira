//import React from "react";
import {
	IonApp,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonFooter,
	IonMenu,
	IonList,
	IonListHeader,
	IonMenuToggle,
	IonIcon,
	IonLabel,
	IonPage,
	IonButtons,
	IonButton,
	IonItem,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

import Home from "./views/Home";
import MintAndRedeem from "views/MintAndRedeem";
import Navbar from "./components/Navbar/Navbar";

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

export default function App() {
	return (
		<IonApp>
			<IonPage className="ion-page" id="main-content">
				<IonReactRouter>
					<Navbar />
					<Route exact path="/">
						// <Redirect to="/home" />
						//{" "}
					</Route>
					<Route exact path="/home">
						<Home />
					</Route>
					<Route exact path="/mintredeem">
						<MintAndRedeem />
					</Route>
				</IonReactRouter>
			</IonPage>
		</IonApp>
	);
}