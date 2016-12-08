import React from "react";
import { render } from "react-dom";

import Presentation from "./containers/presentation";
import "./app.global.css";


render(
  <Presentation remote />,
  document.getElementById("root")
);
