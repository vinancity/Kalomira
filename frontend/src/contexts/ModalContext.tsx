import React, { createContext, useState } from "react";

interface ModalsContext {
  onPresent: (node: React.ReactNode, key?: string) => void;
  onDismiss: () => void;
  // setCloseOnOverlayClick: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalContext = createContext<ModalsContext>({
  onPresent: () => null,
  onDismiss: () => null,
  // setCloseOnOverlayClick: () => true,
});

export const ModalContextProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalNode, setModalNode] = useState<React.ReactNode>();
  const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(true);

  const handlePresent = (node: React.ReactNode) => {
    setModalNode(node);
    setIsOpen(true);
  };

  const handleDismiss = () => {
    setModalNode(undefined);
    setIsOpen(false);
  };

  // const handleOverlayDismiss = () => {
  //   if (closeOnOverlayClick) {
  //     handleDismiss();
  //   }
  // };

  return (
    <ModalContext.Provider value={{ onPresent: handlePresent, onDismiss: handleDismiss }}>
      {isOpen && (
        <>
          {React.isValidElement(modalNode) &&
            React.cloneElement(modalNode, {
              // open: isOpen,
              onDismiss: handleDismiss,
            })}
        </>
      )}
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
