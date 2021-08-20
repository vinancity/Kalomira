import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Provider } from "react-redux";
import { getLibrary } from "./utils/web3React";
import { RefreshContextProvider } from "contexts/RefreshContext";
import store from "./state/index";

export default function Providers({ children }: any) {
	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<Provider store={store}>
				<RefreshContextProvider>{children}</RefreshContextProvider>
			</Provider>
		</Web3ReactProvider>
	);
}
