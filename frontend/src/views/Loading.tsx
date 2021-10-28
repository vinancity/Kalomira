import React from "react";
import { IonContent, IonGrid } from "@ionic/react";
import styled from "styled-components";

const Wrapper = styled(IonGrid)`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
`;

export default function Loading() {
  return (
    <IonContent className="padded-content">
      <Wrapper>Loading...</Wrapper>
    </IonContent>
  );
}
