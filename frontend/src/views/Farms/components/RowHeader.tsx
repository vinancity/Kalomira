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

const ExpandButton = styled(IonButton)`
  --border-radius: 100%;
  width: 35px;
  height: 35px;
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
            <SubLabel>{getFullDisplayBalance(earningsBN, undefined, 4)}</SubLabel>
            <SubLabel>{`$0.00`}</SubLabel>
            <SubLabel>{multiplier || "0x"}</SubLabel>
          </IonRow>
        </LabelColumn>

        <IonCol size="auto" className="ion-margin-start">
          <ExpandButton className="ion-no-padding" fill="clear" color="dark" onClick={toggleExpand}>
            <IonIcon md={chevronDown}></IonIcon>
          </ExpandButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
