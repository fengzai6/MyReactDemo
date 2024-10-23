import { useRef, useEffect } from "react";

/**
 *
 * @param oAuthUrl 跳转的url
 * @returns function openWindow
 */
export const useNewWindow = (oAuthUrl: string) => {
  const width = 500;
  const height = 600;
  const left = window.screenX + (window.innerWidth - width) / 2;
  const top = (window.screen.height - height) / 2;

  const windowFeatures = `width=${width},height=${height},left=${left},top=${top}`;

  // 保存打开的窗口
  const loginWindow = useRef<Window | null>(null);

  // 打开新窗口
  const openWindow = () => {
    loginWindow.current = window.open(oAuthUrl, "_blank", windowFeatures);
  };

  const receiveMessage = (event: MessageEvent) => {
    if (
      event.origin !== "http://localhost:3000" ||
      event.data.source !== "github-callback"
    ) {
      return;
    }

    if (event.data.source === "github-callback") {
      console.log("receiveCode", event.data.code);

      // 通过postMessage发送消息到原窗口提示关闭
      loginWindow.current?.postMessage("close", "http://localhost:3000");
    }
  };

  useEffect(() => {
    window.addEventListener("message", receiveMessage, false);

    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  return { openWindow };
};
