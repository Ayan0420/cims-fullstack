import { useCallback } from "react";
import { useNavigate } from "react-router";

interface PromptOptions {
  title: string;
  label: string;
  value: string;
  inputAttrs: {
    type: string;
  };
  type: string;
}

export interface OpenRouteOptions {
  fallback?: "new-tab" | "same-tab";
}

export function isElectronEnvironment(): boolean {
  return typeof window !== "undefined" && typeof window.electronAPI !== "undefined";
}

function normalizeRoute(route: string): string {
  if (route.startsWith("http://") || route.startsWith("https://")) {
    return route;
  }

  return route.startsWith("/") ? route : `/${route}`;
}

function postOpenWindowMessage(route: string): void {
  window.postMessage(
    {
      type: "OPEN_WINDOW",
      payload: { route },
    },
    "*",
  );
}

export function refreshMain(): void {
  window.electronAPI?.refreshMain();
}

export function closeActiveWindow(): void {
  window.electronAPI?.closeWindow();
}

export function closeAndRefreshMainWindow(): void {
  window.electronAPI?.closeAndRefresh();
}

export async function promptWithFallback(options: PromptOptions): Promise<string | null> {
  if (window.electronAPI?.prompt) {
    return window.electronAPI.prompt(options);
  }

  return window.prompt(options.label, options.value);
}

export function openRoute(route: string, options?: OpenRouteOptions): void {
  const normalizedRoute = normalizeRoute(route);

  if (isElectronEnvironment()) {
    postOpenWindowMessage(normalizedRoute);
    return;
  }

  if (options?.fallback === "same-tab") {
    window.location.assign(normalizedRoute);
    return;
  }

  const popup = window.open(
    normalizedRoute,
    "cims-electron-fallback-popup",
    "popup=yes,width=1280,height=800,left=120,top=80,menubar=no,toolbar=no,location=yes,status=no,resizable=yes,scrollbars=yes",
  );
  if (!popup) {
    window.location.assign(normalizedRoute);
  }
}

export const useOpenNewWindow = () => {
  const navigate = useNavigate();

  return useCallback(
    (route: string, options?: OpenRouteOptions) => {
      const normalizedRoute = normalizeRoute(route);

      if (isElectronEnvironment()) {
        postOpenWindowMessage(normalizedRoute);
        return;
      }

      if (options?.fallback === "same-tab") {
        navigate(normalizedRoute);
        return;
      }

      const popup = window.open(
        normalizedRoute,
        "cims-electron-fallback-popup",
        "popup=yes,width=1280,height=800,left=120,top=80,menubar=no,toolbar=no,location=yes,status=no,resizable=yes,scrollbars=yes",
      );
      if (!popup) {
        navigate(normalizedRoute);
      }
    },
    [navigate],
  );
};
