import ReactDOM from "react-dom/client";
import cssText from "../index.css?inline";
import outfitFontUrl from "@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2?inline";
import { BlockedDialog } from "@/components/blocked-dialog";

const fontStyle = document.createElement("style");
fontStyle.id = "focus-me-font";

fontStyle.textContent = `
  @font-face {
    font-family: "Outfit Variable";
    font-style: normal;
    font-display: swap;
    font-weight: 100 900;
    src: url("${outfitFontUrl}") format("woff2");
  }
`;

(document.head ?? document.documentElement).appendChild(fontStyle);

const host = document.createElement("div");
host.id = "focus-me-extension";

Object.assign(host.style, {
  all: "initial",
  position: "fixed",
  inset: "0",
  zIndex: "2147483647",
  pointerEvents: "none",
  isolation: "isolate",
});

document.body.appendChild(host);

const shadowRoot = host.attachShadow({
  mode: "open",
});

const style = document.createElement("style");
style.textContent = cssText;

shadowRoot.append(style);

const reactContainer = document.createElement("div");
reactContainer.id = "focus-me-react-root";

shadowRoot.appendChild(reactContainer);

ReactDOM.createRoot(reactContainer).render(
  <BlockedDialog portalContainer={shadowRoot} />,
);
