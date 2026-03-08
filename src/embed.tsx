/**
 * Embeddable entry point for the Agent Builder.
 * 
 * This module exports a `mount` function that can be used to render
 * the Agent Builder inside any DOM element, perfect for iframe or
 * widget integration in external frontend apps.
 * 
 * Usage:
 *   import { mount } from './embed';
 *   mount(document.getElementById('agent-builder-root'));
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "./index.css";

export function mount(container: HTMLElement) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  return () => root.unmount();
}

// Auto-mount if loaded directly (iframe mode)
const rootEl = document.getElementById("root");
if (rootEl) {
  mount(rootEl);
}
