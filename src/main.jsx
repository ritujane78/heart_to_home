import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/main.css';
import './styles/components.css';
import './styles/pages/home.css';
import './styles/pages/services.css';
import './styles/pages/gift-form.css';
import './styles/pages/contact.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
