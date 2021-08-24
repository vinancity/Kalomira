import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { IonContent, IonButton } from "@ionic/react";

import { homeSharp, chevronDown } from "ionicons/icons";

import FarmCard from "./components/FarmCard";

import farms from "config/constants/farms";
import styled from "styled-components";

const FlexLayout = styled.div`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	& > * {
		min-width: 280px;
		max-width: 31.5%;
		width: 100%;
		margin: 0 8px;
		margin-bottom: 32px;
	}
`;

const renderContent = () => {
	farms.map((farm) => {
		<IonButton>${farm.pid}</IonButton>;
	});
};

export default function Farms() {
	return (
		<IonContent className="padded-content">
			{farms.map((farm) => {
				return <FarmCard lpLabel={farm.lpSymbol} />;
			})}
		</IonContent>
	);
}
