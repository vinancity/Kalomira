import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import styled from "styled-components";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonToggle,
} from "@ionic/react";
import HeaderCard from "./components/HeaderCard";
import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import { usePollFarmsWithUserData, useFarms } from "state/farms/hooks";
import usePersistState from "hooks/usePersistState";
import { Farm } from "state/types";
import { getBalanceNumber } from "utils/formatBalance";
import { orderBy } from "lodash";
import isArchivedPid from "utils/farmHelpers";
import FarmRow from "./components/FarmRow";
import farms from "config/constants/farms";

const FlexColumn = styled(IonCol)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 5px;
  color: var(--ion-color-light);
`;

const Toggle = styled(IonToggle)`
  --background-checked: var(--ion-color-medium);
  --handle-background: var(--ion-color-light);
  --handle-background-checked: var(--ion-color-light);
`;

export default function Farms() {
  const { data: farmsLP, userDataLoaded } = useFarms();
  const { account } = useWeb3React();
  const [sortOption, setSortOption] = useState("hot");

  //console.log(farmsLP);

  const isArchived = false;
  const isInactive = false;
  const isActive = !isInactive && !isArchived;

  // usePollFarmsWithUserData();

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded);
  const activeFarms = farmsLP.filter((farm) => farm.multiplier !== "0X" && !isArchivedPid(farm.pid));
  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  );

  const rowData = farmsLP.map((farm) => {
    const row = {
      farm: {
        label: farm.lpSymbol,
        pid: farm.pid,
      },
      earned: {
        earnings: getBalanceNumber(new BigNumber(farm.userData.earnings)),
        pid: farm.pid,
      },
      multiplier: {
        multiplier: farm.multiplier,
      },
      details: farm,
    };
    return row;
  });

  const handleHarvestAll = () => {
    console.log("harvest all");
  };

  return (
    <IonContent className="padded-content">
      <HeaderCard account={account} totalHarvest={"123.4567"} onHarvestAll={handleHarvestAll} />
      <IonGrid>
        <IonRow>
          <FlexColumn className="ion-no-padding">Staked Only</FlexColumn>
          <IonCol size="auto" className="ion-no-padding">
            <Toggle></Toggle>
          </IonCol>
        </IonRow>
      </IonGrid>
      {rowData.map((row, index) => {
        const data = { ...row.details, ...row.earned, ...row.multiplier };
        return <FarmRow key={`row-${index}`} {...data} userDataReady={userDataReady} />;
      })}
    </IonContent>
  );
}
