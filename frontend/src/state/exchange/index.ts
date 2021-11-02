import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllowance } from "./fetchData";

interface UserDataResponse {
  allowance: string;
}

const initialState = {
  allowance: "",
};

export const fetchExchangeAllowanceAsync = createAsyncThunk<UserDataResponse, { account: string }>(
  "exchange/fetchExchangeAllowanceAsync",
  async ({ account }) => {
    const exchangeAllowance = await fetchAllowance(account);

    return { allowance: exchangeAllowance };
  }
);

export const exchangeSlice = createSlice({
  name: "Exchange",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // update with allowance
    builder.addCase(fetchExchangeAllowanceAsync.fulfilled, (state, action) => {
      state.allowance = action.payload.allowance;
    });
  },
});

export default exchangeSlice.reducer;
