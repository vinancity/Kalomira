import React, { useState } from "react";
import { IonModal, IonButton, IonRow, IonCol, IonInput, IonGrid } from "@ionic/react";
import { FormEvent } from "react";

export default function DepositModal({ max, lpSymbol, onConfirm, showModal, setShowModal }) {
  const [stakeAmount, setStakeAmount] = useState("");
  const [valid, setValid] = useState(true);

  const handleChange = (e: CustomEvent) => {
    let regex = /^[0-9]*[.]?[0-9]*$/;
    if (regex.test(e.detail.value)) {
      setStakeAmount(e.detail.value);
      if (!valid) setValid(true);
    } else {
      setValid(false);
    }
    console.log(`${valid ? "" : "in"}valid`);
  };

  const handleConfirm = () => {
    onConfirm(stakeAmount);
    setShowModal(false);
    console.log("Staking: ", stakeAmount);
  };

  return (
    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
      <IonGrid>
        <IonInput
          className="ion-padding"
          placeholder="0"
          min="0"
          inputmode="decimal"
          clearInput
          onIonChange={(e) => {
            handleChange(e);
          }}
          onKeyPress={(e) => {
            let regex = /^[0-9]*[.]?[0-9]*$/;
            if (!regex.test(e.key)) {
              e.preventDefault();
            }
          }}
          required
        ></IonInput>
        <IonButton fill="outline">Max</IonButton>
        <IonButton disabled={!valid} onClick={handleConfirm}>
          Confirm
        </IonButton>
      </IonGrid>
    </IonModal>
  );
}
