import { memo } from "react";
import styled from "styled-components";
import { IonAvatar, IonButton, IonCol, IonGrid, IonImg, IonItem, IonRow } from "@ionic/react";
import { NumericalInput } from "./NumericalInput";

export const InputWrapper = styled(IonItem)`
  --min-height: 130px;
  margin: 5px 0px 5px 0px;
  border-radius: 8px;
  --background: var(--ion-color-light-tint);
  --border-style: none;
`;

export const InputGrid = styled(IonGrid)`
  display: flex;
  flex-flow: column;
  justify-content: space-evenly;
  height: 100%;
  padding: 15px 02px 10px 0px;
`;

export const Input = memo(function InnerInput({
  value,
  label1,
  label2,
  tokenLabel,
  iconSrc,
  readonly,
  onUserInput = () => {},
  withMax = false,
  onMax = () => {},
}: {
  value: string;
  label1: string;
  label2: string;
  tokenLabel: string;
  iconSrc?: string;
  readonly?: boolean;
  withMax: boolean;
  onMax?: () => void;
  onUserInput?: (input: string) => void;
}) {
  return (
    <InputWrapper>
      <InputGrid className="ion-align-self-start">
        <IonRow className="ion-align-items-center ion-margin-bottom">
          <IonCol>{`${label1}`}</IonCol>
          {withMax && (
            <IonCol size="auto">
              <IonButton className="ion-no-margin" onClick={onMax}>
                MAX
              </IonButton>
            </IonCol>
          )}
          <IonCol size="auto" className="ion-text-end ion-margin-start">
            {`${label2}`}
          </IonCol>
        </IonRow>
        <IonRow className="ion-align-items-center" style={{ flexGrow: 1 }}>
          <IonCol>
            <NumericalInput value={value} onUserInput={onUserInput} readonly={readonly} />
          </IonCol>
          <IonCol size="auto" className="ion-text-center">
            <IonAvatar style={{ transform: "scale(0.8)" }}>
              <IonImg src={iconSrc || "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"} />
            </IonAvatar>
          </IonCol>
          <IonCol size="1.5" className="ion-text-center">
            {`${tokenLabel}`}
          </IonCol>
        </IonRow>
      </InputGrid>
    </InputWrapper>
  );
});
