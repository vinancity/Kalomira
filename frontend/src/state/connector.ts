import { createSlice } from "@reduxjs/toolkit";
import { ConnectorNames } from "utils/walletTypes";

export interface ConnectorState {
	type: ConnectorNames;
}

export const initialState: ConnectorState = {
	type: undefined,
};

export const connectorSlice = createSlice({
	name: "connector",
	initialState,
	reducers: {
		setConnector: (state, action) => {
			state.type = action.payload;
		},

		clearConnector: (state) => {
			state.type = undefined;
		},
	},
});

export const { setConnector, clearConnector } = connectorSlice.actions;

export default connectorSlice.reducer;
