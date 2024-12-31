import { useAppContext } from "@/app-context";
import { useEffect } from "react";
import WuJieReact from "wujie-react";

export const LoadWujiePlugins = (props: Partial<WuJieReact>) => {
  const { setupApp, preloadApp } = WuJieReact;
  const { setWuJieState } = useAppContext();

  const lifecycles = {
    beforeLoad: (appWindow: Window) => {
      console.log(`${appWindow.__WUJIE.id} beforeLoad 生命周期`, appWindow);
      setWuJieState((prev) => ({
        ...prev,
        loading: true,
      }));
    },
    beforeMount: (appWindow: Window) =>
      console.log(`${appWindow.__WUJIE.id} beforeMount 生命周期`),
    afterMount: (appWindow: Window) =>
      console.log(`${appWindow.__WUJIE.id} afterMount 生命周期`),
    beforeUnmount: (appWindow: Window) =>
      console.log(`${appWindow.__WUJIE.id} beforeUnmount 生命周期`),
    afterUnmount: (appWindow: Window) =>
      console.log(`${appWindow.__WUJIE.id} afterUnmount 生命周期`),
    activated: (appWindow: Window) => {
      console.log(`${appWindow.__WUJIE.id} activated 生命周期`);
    },
    deactivated: (appWindow: Window) =>
      console.log(`${appWindow.__WUJIE.id} deactivated 生命周期`),
    loadError: (url: string, e: unknown) => console.log(`${url} 加载失败`, e),
  };

  const childs = [
    {
      name: "wujie-child",
      url: "https://3057.qqwj.top/",
      // url: "http://localhost:3057/",
    },
    // 待定
    {
      name: "wujie-child-2",
      url: "http://localhost:3058",
    },
    // {
    //   name: "https://webpack.js.org/",
    //   url: "https://webpack.js.org/",
    // },
  ];

  useEffect(() => {
    setWuJieState((prev) => {
      if (prev.plugins.length) {
        return prev;
      }

      return {
        ...prev,
        plugins: childs.map((child) => ({
          name: child.name,
          url: child.url,
        })),
      };
    });

    childs.forEach((child) => {
      setupApp({
        ...child,
        exec: true,
        alive: true,
        ...lifecycles,
      });

      preloadApp({
        ...child,
        props: props.props,
      });
    });
  }, []);

  return (
    <div className="flex flex-wrap">
      {childs.map((child) => (
        <div key={child.name} className="w-1/2 max-h-[50vh] overflow-auto">
          <WuJieReact
            key={child.name}
            {...child}
            {...props}
            width="100%"
            height="100%"
          ></WuJieReact>
        </div>
      ))}
    </div>
  );
};
