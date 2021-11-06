import styled from "styled-components";
import { IonGrid, IonRow, IonCol, IonIcon, IonButton, IonAvatar, IonImg } from "@ionic/react";
import { getFullDisplayBalance } from "utils/formatBalance";
import { chevronDown } from "ionicons/icons";
import BigNumber from "bignumber.js";

const HeaderLabel = styled(IonCol)`
  text-align: start;
  font-weight: bold;
`;

const SubLabel = styled(IonCol)`
  text-align: start;
  color: var(--ion-color-medium-tint);
`;

const FlexColumn = styled(IonCol)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.4px;
`;

const LabelColumn = styled(IonCol)`
  display: flex;
  flex-flow: column;
  justify-content: center;
`;

export default function RowHeader(props) {
  const { lpSymbol, multiplier, earnings, userData, toggleExpand } = props;
  const earningsBN = new BigNumber(earnings);

  return (
    <IonGrid className="ion-no-padding">
      <IonRow>
        <IonCol size="auto">
          <IonAvatar style={{ height: "40px", width: "40px" }}>
            <IonImg src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
          </IonAvatar>
        </IonCol>
        <FlexColumn size="3.5" className="ion-padding-start">
          {lpSymbol}
        </FlexColumn>

        <LabelColumn>
          <IonRow>
            <HeaderLabel>Earned</HeaderLabel>
            <HeaderLabel>Liquidity</HeaderLabel>
            <HeaderLabel>Multiplier</HeaderLabel>
          </IonRow>
          <IonRow>
            <SubLabel>{lpSymbol}</SubLabel>
            <SubLabel>{getFullDisplayBalance(earningsBN, undefined, 4)}</SubLabel>
            <SubLabel>{multiplier || "0x"}</SubLabel>
          </IonRow>
        </LabelColumn>

        <IonCol size="auto" className="ion-margin-start">
          <IonButton
            className="circle-btn ion-no-padding ion-no-margin"
            fill="clear"
            color="dark"
            shape="round"
            onClick={() => toggleExpand()}
          >
            <IonIcon md={chevronDown}></IonIcon>
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}

{
  /* <IonRow>
            <IonCol>Farm</IonCol>
            <IonCol>Earned</IonCol>
            <IonCol>Multiplier</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>{lpSymbol}</IonCol>
            <IonCol>{getFullDisplayBalance(earningsBN, undefined, 4)}</IonCol>
            <IonCol>{multiplier}</IonCol>
          </IonRow>
        </IonCol>
        <IonCol size="1">
          <IonButton
            className="circle-btn ion-no-padding"
            fill="clear"
            color="dark"
            shape="round"
            onClick={() => toggleExpand()}
          >
            <IonIcon md={chevronDown}></IonIcon>
          </IonButton> */
}
