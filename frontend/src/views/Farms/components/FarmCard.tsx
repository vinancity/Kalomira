import React, { useState } from "react";
import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent } from "@ionic/react";

import CardHeader from "./CardHeader";
import HarvestActions from "./Actions/HarvestActions";
import StakeActions from "./Actions/StakeActions";

export default function FarmCard(props) {
  const [showExpand, setShowExpand] = useState(false);
  const toggleExpand = () => {
    setShowExpand(!showExpand);
  };

  return (
    <div>
      <IonCard>
        <IonCardHeader color="light">
          <CardHeader {...props} toggleExpand={toggleExpand} />
        </IonCardHeader>

        <IonCardContent hidden={!showExpand}>
          <IonGrid>
            <IonRow>
              <IonCol>
                <HarvestActions {...props} />
              </IonCol>
              <IonCol>
                <StakeActions {...props} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    </div>
  );
}
