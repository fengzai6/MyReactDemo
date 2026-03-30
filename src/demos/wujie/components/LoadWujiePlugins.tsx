import { useEffect } from "react";
import WujieReact from "wujie-react";
import { CHILD_APPS } from "../constants";
import { useWujieStore } from "../store/useWujieStore";
import type { IWuJieChildProps } from "../types";

interface ILoadWujiePluginsProps {
  props: IWuJieChildProps;
}

export const LoadWujiePlugins = ({ props }: ILoadWujiePluginsProps) => {
  const { setupApp, preloadApp } = WujieReact;
  const setLoading = useWujieStore((s) => s.setLoading);
  const initPlugins = useWujieStore((s) => s.initPlugins);

  type WujieWindow = Window & { __WUJIE: { id: string } };

  const lifecycles = {
    beforeLoad: (appWindow: WujieWindow) => {
      console.log(`${appWindow.__WUJIE.id} beforeLoad 生命周期`, appWindow);
      setLoading(true);
    },
    beforeMount: (appWindow: WujieWindow) =>
      console.log(`${appWindow.__WUJIE.id} beforeMount 生命周期`),
    afterMount: (appWindow: WujieWindow) =>
      console.log(`${appWindow.__WUJIE.id} afterMount 生命周期`),
    beforeUnmount: (appWindow: WujieWindow) =>
      console.log(`${appWindow.__WUJIE.id} beforeUnmount 生命周期`),
    afterUnmount: (appWindow: WujieWindow) =>
      console.log(`${appWindow.__WUJIE.id} afterUnmount 生命周期`),
    activated: (appWindow: WujieWindow) =>
      console.log(`${appWindow.__WUJIE.id} activated 生命周期`),
    deactivated: (appWindow: WujieWindow) =>
      console.log(`${appWindow.__WUJIE.id} deactivated 生命周期`),
    loadError: (url: string, e: unknown) => console.log(`${url} 加载失败`, e),
  };

  useEffect(() => {
    initPlugins();

    CHILD_APPS.forEach((child) => {
      // @ts-expect-error wujie-react 类型声明待补充
      setupApp({
        ...child,
        exec: true,
        alive: false,
        ...lifecycles,
      });
      preloadApp({
        ...child,
        props,
      });
    });
  }, []);

  return (
    <div className="flex flex-wrap">
      {CHILD_APPS.map((child) => (
        <div key={child.name} className="max-h-[50vh] w-1/2 overflow-auto">
          <WujieReact
            // @ts-expect-error wujie-react 类型声明待补充
            name={child.name}
            url={child.url}
            props={props}
            width="100%"
            height="100%"
          />
        </div>
      ))}
    </div>
  );
};
