import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Providers from "./Providers";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

ReactDOM.render(
	<React.StrictMode>
		<Providers>
			<App />
		</Providers>
	</React.StrictMode>,
	document.getElementById("root")
);

serviceWorkerRegistration.register();
