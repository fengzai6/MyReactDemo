import { message } from "antd";
import WuJieReact from "wujie-react";
import { WujieChild } from "./WujieChild";

import "./api";

export const WuJie = () => {
  const { setupApp, preloadApp, bus } = WuJieReact;

  const lifecycles = {
    beforeLoad: (appWindow: Window) =>
      console.log(`${appWindow.__WUJIE.id} beforeLoad 生命周期`, appWindow),
    beforeMount: (appWindow: Window) =>
      console.log(`${appWindow.__WUJIE.id} beforeMount 生命周期`),
    afterMount: (appWindow: Window) =>
      console.log(`${appWindow.__WUJIE.id} afterMount 生命周期`),
    beforeUnmount: (appWindow: Window) =>
      console.log(`${appWindow.__WUJIE.id} beforeUnmount 生命周期`),
    afterUnmount: (appWindow: Window) =>
      console.log(`${appWindow.__WUJIE.id} afterUnmount 生命周期`),
    activated: (appWindow: Window) =>
      console.log(`${appWindow.__WUJIE.id} activated 生命周期`),
    deactivated: (appWindow: Window) =>
      console.log(`${appWindow.__WUJIE.id} deactivated 生命周期`),
    loadError: (url: string, e: unknown) => console.log(`${url} 加载失败`, e),
  };

  setupApp({
    name: "wujie-child",
    url: "http://localhost:3057/",
    exec: true,
    ...lifecycles,
  });

  preloadApp({
    name: "wujie-child",
    url: "http://localhost:3057/",
  });

  bus.$on("showMessage", (msg: string) => {
    message.info(msg);
  });
  return (
    <div>
      <h1>Main App</h1>

      <WujieChild />
    </div>
  );
};
