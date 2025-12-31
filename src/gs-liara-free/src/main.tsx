import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import "Vazirmatn/Vazirmatn-Variable-font-face.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import Routes from "./Routes.tsx";
import AuthProvider from "./features/auth/AuthProvider.tsx";
import "./index.css";

const darkTheme = createTheme({
  colorSchemes: { dark: true, light: true },
  defaultColorScheme: "dark",
  typography: {
    fontFamily: '"Vazirmatn", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      theme={darkTheme}
      defaultMode="system"
      disableTransitionOnChange
    >
      <CssBaseline enableColorScheme />
      <AuthProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
