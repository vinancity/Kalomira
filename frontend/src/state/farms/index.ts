import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import farmsConfig from "config/constants/farms";
import isArchivedPid from "utils/farmHelpers";
import fetchFarms from "./fetchFarms";
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
} from "./fetchFarmUser";

import { FarmsState, Farm } from "state/types";

const noAccountFarmConfig = farmsConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: "0",
    tokenBalance: "0",
    stakedBalance: "0",
    earnings: "0",
  },
}));

const initialState: FarmsState = {
  data: noAccountFarmConfig,
  loadArchivedFarmsData: false,
  userDataLoaded: false,
};

export const nonArchivedFarms = farmsConfig.filter(({ pid }) => !isArchivedPid(pid));

export const fetchFarmsPublicDataAsync = createAsyncThunk<Farm[], number[]>(
  "farms/fetchFarmsPublicDataAsync",
  async (pids) => {
    const farmsToFetch = nonArchivedFarms;
    const farms = await fetchFarms(farmsToFetch);
    return farms;
  }
);

interface FarmUserDataResponse {
  pid: number;
  allowance: string;
  tokenBalance: string;
  stakedBalance: string;
  earnings: string;
}

export const fetchFarmUserDataAsync = createAsyncThunk<FarmUserDataResponse[], { account: string; pids: number[] }>(
  "farms/fetchFarmUserDataAsync",
  async ({ account, pids }) => {
    const farmsToFetch = farmsConfig.filter((farmsConfig) => pids.includes(farmsConfig.pid));
    const userFarmAllowances = await fetchFarmUserAllowances(account, farmsToFetch);
    const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, farmsToFetch);
    const userStakedBalances = await fetchFarmUserStakedBalances(account, farmsToFetch);
    const userFarmEarnings = await fetchFarmUserEarnings(account, farmsToFetch);

    return userFarmAllowances.map((farmAllowance, index) => {
      return {
        pid: farmsToFetch[index].pid,
        allowance: userFarmAllowances[index],
        tokenBalance: userFarmTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        earnings: userFarmEarnings[index],
      };
    });
  }
);

export const farmsSlice = createSlice({
  name: "Farms",
  initialState,
  reducers: {
    setLoadArchivedFarmsData: (state, action) => {
      const loadArchivedFarmsData = action.payload;
      state.loadArchivedFarmsData = loadArchivedFarmsData;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((farm) => {
        const liveFarmData = action.payload.find((farmData) => farmData.pid === farm.pid);
        return { ...farm, ...liveFarmData };
      });
    });

    builder.addCase(fetchFarmUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { pid } = userDataEl;
        const index = state.data.findIndex((farm) => farm.pid === pid);
        state.data[index] = { ...state.data[index], userData: userDataEl };
      });
      state.userDataLoaded = true;
    });
  },
});

export const { setLoadArchivedFarmsData } = farmsSlice.actions;

export default farmsSlice.reducer;
