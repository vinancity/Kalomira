import React from "react";
import ReactDOM from "react-dom";
import { Dapp } from "./components/Dapp";
import { KaiDapp } from "./components/KAI_Dapp";

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/js/dist/dropdown"
import "bootstrap/js/dist/modal"

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

ReactDOM.render(
  <React.StrictMode>
    <KaiDapp />
  </React.StrictMode>,
  document.getElementById("root")
);
