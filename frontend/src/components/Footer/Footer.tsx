import { IonFooter, IonToolbar, IonGrid, IonRow, IonCol, IonButton, IonToggle, IonIcon, IonLabel } from "@ionic/react";

export default function Footer() {
  const toggleTheme = (event) => {
    let systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    systemDark.addListener(colorTest);
    if (event.detail.checked) {
      document.body.setAttribute("data-theme", "light");
    } else {
      document.body.setAttribute("data-theme", "dark");
    }
  };
  function colorTest(systemInitiatedDark) {
    if (systemInitiatedDark.matches) {
      document.body.setAttribute("data-theme", "light");
    } else {
      document.body.setAttribute("data-theme", "dark");
    }
  }
  return (
    <IonFooter mode="md">
      <IonToolbar>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonToggle checked onIonChange={(e) => toggleTheme(e)}>
                Light/Dark
              </IonToggle>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonToolbar>
    </IonFooter>
  );
}
