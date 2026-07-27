import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/main.css';
import './styles/components.css';
import './styles/pages/home.css';
import './styles/pages/services.css';
import './styles/pages/gift-form.css';
import './styles/pages/contact.css';
import ScrollToTop from './components/ScrollToTop.jsx';
import { ContextProvider } from "./store/ContextApi";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_test_51TxMxMDyTmz3xrAjsv8WtqrzfyIO6Qf3W4JnMUw3wxardfV1N9AjQ7tYsOdGVLiUJSyFX3AN9VXaPilVfg6dUdkr0076S9EhIw")

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <ScrollToTop />
      <ContextProvider>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </ContextProvider>
    </BrowserRouter>
);
