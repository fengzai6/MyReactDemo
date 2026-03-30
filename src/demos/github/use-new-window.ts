import { useRef, useEffect } from "react";

export const useNewWindow = (oAuthUrl: string) => {
  const width = 500;
  const height = 600;
  const left = window.screenX + (window.innerWidth - width) / 2;
  const top = (window.screen.height - height) / 2;
  const windowFeatures = `width=${width},height=${height},left=${left},top=${top}`;
  const loginWindow = useRef<Window | null>(null);

  const openWindow = () => {
    loginWindow.current = window.open(oAuthUrl, "_blank", windowFeatures);
  };

  const receiveMessage = (event: MessageEvent) => {
    if (event.origin !== "http://localhost:3000" || event.data.source !== "github-callback") return;
    if (event.data.source === "github-callback") {
      console.log("receiveCode", event.data.code);
      loginWindow.current?.postMessage("close", "http://localhost:3000");
    }
  };

  useEffect(() => {
    window.addEventListener("message", receiveMessage, false);
    return () => { window.removeEventListener("message", receiveMessage); };
  }, []);

  return { openWindow };
};
