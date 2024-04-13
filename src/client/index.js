import React from "react";
import { createRoot } from 'react-dom/client';
import App from "../client/app.jsx"

const root = createRoot(document.getElementById("root"));

root.render(<App/>);