import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App.jsx";
import awsConfig from "./aws-exports";
import { theme } from "./styles/theme.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/globals.css";

//Initialize AWS Amplify (Cognito setup)
Amplify.configure(awsConfig);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
