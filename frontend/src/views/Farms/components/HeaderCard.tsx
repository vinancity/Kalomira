import styled from "styled-components";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
} from "@ionic/react";
import ConnectWalletButton from "components/ConnectWalletButton";

const Card = styled(IonCard)`
  border-radius: 8px;
  min-height: 150px;
  margin-bottom: 20px;
`;

const CardTitle = styled(IonCardTitle)`
  font-weight: bold;
  font-size: 1.5rem;
`;

const CardSubTitle = styled(IonCardSubtitle)`
  color: var(--ion-color-medium-tint) !important;
`;

const ContentWrapper = styled(IonGrid)`
  display: flex;
  flex-flow: column;
  padding: 20px 0px 10px;
`;

const Label = styled(IonLabel)`
  font-size: 2rem;
`;

const AmountLabel = styled(IonLabel)`
  font-size: 3rem;
  font-weight: bold;
  line-height: 3rem;
`;

const SubLabel = styled(IonLabel)`
  color: var(--ion-color-medium-tint);
`;

const Button = styled(IonButton)`
  height: 50px;
  width: 250px;
  font-size: 1.5rem;
`;

const FlexColumn = styled(IonCol)`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

export default function HeaderCard({ account, totalHarvest, onHarvestAll }) {
  return (
    <Card>
      <IonCardHeader color="light">
        <CardTitle>Farms</CardTitle>
        <CardSubTitle className="ion-no-margin">Stake LP in our farms to earn everyday</CardSubTitle>
      </IonCardHeader>
      <IonCardContent>
        <ContentWrapper>
          <IonRow>
            <IonCol className="ion-no-padding">
              <IonRow className="ion-margin-bottom ion-padding-bottom">
                <Label>Total KALO to harvest:</Label>
              </IonRow>
              <IonRow>
                <IonCol className="ion-no-padding">
                  <AmountLabel>{account ? `${totalHarvest}` : `0.0000`}</AmountLabel>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="ion-no-padding">
                  <SubLabel>{account ? `$123.45` : `$0.00`}</SubLabel>
                </IonCol>
              </IonRow>
            </IonCol>
            <FlexColumn>
              {account ? (
                <Button onClick={onHarvestAll}>Harvest all</Button>
              ) : (
                <ConnectWalletButton
                  style={{ height: "50px", width: "250px", fontSize: "1.5rem", "--border-width": "3px" }}
                />
              )}
            </FlexColumn>
          </IonRow>
        </ContentWrapper>
      </IonCardContent>
    </Card>
  );
}
