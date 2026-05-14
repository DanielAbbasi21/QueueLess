import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/index.css";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/form.css";
import "./styles/badges.css";
import "./styles/buttons.css";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
