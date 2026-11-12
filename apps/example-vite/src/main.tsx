import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { LinkProvider } from "@loica-ui/react";
import "./styles.css";
import "@loica-ui/react/tokens.css";
import "@loica-ui/react/css/alert.css";
import "@loica-ui/react/css/avatar.css";
import "@loica-ui/react/css/badge.css";
import "@loica-ui/react/css/breadcrumb.css";
import "@loica-ui/react/css/button.css";
import "@loica-ui/react/css/card.css";
import "@loica-ui/react/css/code.css";
import "@loica-ui/react/css/datepicker.css";
import "@loica-ui/react/css/drawer.css";
import "@loica-ui/react/css/dropdown.css";
import "@loica-ui/react/css/field.css";
import "@loica-ui/react/css/heading.css";
import "@loica-ui/react/css/input.css";
import "@loica-ui/react/css/kbd.css";
import "@loica-ui/react/css/link.css";
import "@loica-ui/react/css/modal.css";
import "@loica-ui/react/css/navbar.css";
import "@loica-ui/react/css/paginator.css";
import "@loica-ui/react/css/progressbar.css";
import "@loica-ui/react/css/radio.css";
import "@loica-ui/react/css/select.css";
import "@loica-ui/react/css/sidebar.css";
import "@loica-ui/react/css/skeleton.css";
import "@loica-ui/react/css/table.css";
import "@loica-ui/react/css/tabs.css";
import "@loica-ui/react/css/text.css";
import "@loica-ui/react/css/textarea.css";
import "@loica-ui/react/css/toast.css";
import "./i18n";
import { App } from "./app";
import { RouterAnchor } from "./components/router-anchor";
import { Providers } from "./providers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <BrowserRouter>
        <LinkProvider component={RouterAnchor}>
          <App />
        </LinkProvider>
      </BrowserRouter>
    </Providers>
  </StrictMode>,
);
