import { useState } from "react";
import styled from "styled-components";
import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent } from "@ionic/react";

import RowHeader from "./RowHeader";
import HarvestActions from "./Actions/HarvestActions";
import StakeActions from "./Actions/StakeActions";

const ContentGrid = styled(IonGrid)`
  padding: 15px 0px 5px;
`;

const FlexColumn = styled(IonCol)`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const ActionWrapper = styled(IonCol)`
  border-color: var(--ion-color-light);
  border-width: 4px;
  border-style: solid;
  border-radius: 8px;
  margin-left: 15px;
  padding: 10px;
`;

export default function FarmRow(props) {
  const [showExpand, setShowExpand] = useState(false);
  const toggleExpand = () => {
    setShowExpand(!showExpand);
  };
  const { lpSymbol } = props;
  return (
    <>
      <IonCard style={{ borderRadius: "8px" }}>
        <IonCardHeader color="light">
          <RowHeader {...props} toggleExpand={toggleExpand} />
        </IonCardHeader>

        <IonCardContent hidden={!showExpand}>
          <ContentGrid>
            <IonRow>
              <FlexColumn>
                <IonRow>
                  <a href="#">{`Get ${lpSymbol}`}</a>
                </IonRow>
                <IonRow>
                  <a href="#">{`View LP Contract`}</a>
                </IonRow>
              </FlexColumn>
              <ActionWrapper>
                <HarvestActions {...props} />
              </ActionWrapper>
              <ActionWrapper>
                <StakeActions {...props} />
              </ActionWrapper>
            </IonRow>
          </ContentGrid>
        </IonCardContent>
      </IonCard>
    </>
  );
}
