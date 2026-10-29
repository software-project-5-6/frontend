import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter.jsx";
import { BRANDING } from "./config/branding";

export default function App() {
  useEffect(() => {
    document.title = BRANDING.browserTitle;
  }, []);

  return <AppRouter />;
}
