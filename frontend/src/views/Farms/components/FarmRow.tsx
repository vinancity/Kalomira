import React, { useState } from "react";
import styled from "styled-components";
import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent } from "@ionic/react";

import RowHeader from "./RowHeader";
import HarvestActions from "./Actions/HarvestActions";
import StakeActions from "./Actions/StakeActions";

const ContentGrid = styled(IonGrid)`
  padding: 20px 0px 5px;
`;

export default function FarmRow(props) {
  const [showExpand, setShowExpand] = useState(false);
  const toggleExpand = () => {
    setShowExpand(!showExpand);
  };

  return (
    <div>
      <IonCard style={{ borderRadius: "8px" }}>
        <IonCardHeader color="light">
          <RowHeader {...props} toggleExpand={toggleExpand} />
        </IonCardHeader>

        <IonCardContent hidden={!showExpand}>
          <ContentGrid>
            <IonRow>
              <IonCol>
                <IonRow>asdfasdf</IonRow>
                <IonRow>asdfasdf</IonRow>
              </IonCol>
              <IonCol>
                <HarvestActions {...props} />
              </IonCol>
              <IonCol>
                <StakeActions {...props} />
              </IonCol>
            </IonRow>
          </ContentGrid>
        </IonCardContent>
      </IonCard>
    </div>
  );
}
