import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import connectorReducer from "./connector";
import farmsReducer from "./farms";

const store = configureStore({
	reducer: {
		connector: connectorReducer,
		farms: farmsReducer,
	},
});

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
