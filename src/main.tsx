import "@/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Main entry point for the application.
 * @description This is where the React application is initialized and rendered.
 *
 * components used:
 * - App: The main application component.
 * - QueryClientProvider: Provides the React Query client to the application.
 * - QueryClient: The client instance for React Query, used for managing server state.
 *
 * @returns {JSX.Element} The main application component wrapped in QueryClientProvider.
 *
 * @example
 * <Main />
 */

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <App />
    </StrictMode>
  </QueryClientProvider>
);
