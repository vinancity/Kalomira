import { memo, KeyboardEvent } from "react";
import styled from "styled-components";
import { IonInput } from "@ionic/react";
import { InputChangeEventDetail } from "@ionic/core";

const Input = styled(IonInput)`
  --color: var(--ion-color-dark);
  font-size: 2rem;
  font-weight: bold;
  border-radius: 8px;
`;

export const NumericalInput = memo(function InnerInput({
  value,
  onUserInput,
  readonly = false,
}: {
  value: string | number;
  onUserInput: (input: string) => void;
  readonly?: boolean;
}) {
  const inputRegex = RegExp(`^[0-9]*(?:[.])?[0-9]{0,18}$`);

  const handleKeyPress = (e: KeyboardEvent<HTMLIonInputElement>) => {
    if (!inputRegex.test(value + e.key)) {
      e.preventDefault();
    }
  };

  const handleFromChange = (e: CustomEvent<InputChangeEventDetail>) => {
    if (inputRegex.test(e.detail.value)) {
      e.preventDefault();
      onUserInput(e.detail.value);
    }
  };

  return (
    <Input
      placeholder="0.000"
      value={value}
      onKeyPress={(e) => handleKeyPress(e)}
      onIonChange={(e) => handleFromChange(e)}
      readonly={readonly}
    />
  );
});
