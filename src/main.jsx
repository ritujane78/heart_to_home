import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/main.css';
import './styles/components.css';
import './styles/pages/home.css';
import './styles/pages/services.css';
import './styles/pages/gift-form.css';
import './styles/pages/contact.css';
import { ContextProvider } from "./store/ContextApi";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContextProvider>
        <App />
      </ContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
