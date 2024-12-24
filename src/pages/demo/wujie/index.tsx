import { Button, message, Modal, Skeleton } from "antd";
import WuJieReact from "wujie-react";
import { WujieChild } from "./WujieChild";
import { ChildComponent2 } from "./child-child";

import { useEffect, useState } from "react";
import "./api";

const ChildComponent = () => {
  const { bus } = WuJieReact;

  useEffect(() => {
    bus.$on("showMessage", (msg: string) => {
      message.info(msg);
    });

    return () => {
      bus.$off("showMessage", (msg: string) => {
        message.info(msg);
      });
    };
  }, []);

  return (
    <div>
      <ChildComponent2 />
      Main App Child Component
    </div>
  );
};

export interface Components {
  link?: (data: any) => JSX.Element | null;
  number?: (num: number) => {
    num: number;
    callback: Function;
  };
}

export interface IChildProps {
  showMessage: (msg: string) => void;
  showMsgWithParentData: (callback: (msg: string) => string) => void;
  init: (props: Components) => void;
}

export const WuJie = () => {
  const { setupApp, preloadApp, bus } = WuJieReact;

  const [components, setComponents] = useState<Components>({});

  const [loading, setLoading] = useState(false);

  const lifecycles = {
    beforeLoad: (appWindow: Window) => {
      console.log(`${appWindow.__WUJIE.id} beforeLoad 生命周期`, appWindow);
      setLoading(true);
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

  // bus.$on("showMessage", (msg: string) => {
  //   message.info(msg);
  // });

  const showMessage = (msg: string) => {
    message.success(msg);
  };

  const showMsgWithParentData = (callback: (msg: string) => string) => {
    const msg = callback("hello wujie");

    message.success(msg);
  };

  const data = {
    url: "http://localhost:3057/",
    name: "wujie-child",
  };

  const init = (props: Components) => {
    setComponents(props);
    setLoading(false);
  };

  const ProgressLink = () => {
    const link = components.link?.(data);

    if (link) {
      return link;
    } else {
      return <a>默认 a 标签</a>;
    }
  };

  const ProgressNum = () => {
    const [num, setNum] = useState(0);

    const number = components.number?.(num);

    if (number) {
      return (
        <div
          onClick={() => {
            number.callback();
            setNum(number.num);
          }}
        >
          {number.num}
        </div>
      );
    }
  };

  const ModalBox = () => {
    const [visible, setVisible] = useState(false);

    return (
      <div>
        <Button
          onClick={() => {
            setVisible(true);
          }}
        >
          show modal
        </Button>

        <Modal
          open={visible}
          onCancel={() => {
            console.log("close");
            setVisible(false);
          }}
        >
          <ProgressLink />
          <ProgressNum />
        </Modal>
      </div>
    );
  };

  useEffect(() => {
    console.log("components", components);
  }, [components]);

  return (
    <div>
      <h1>Main App</h1>
      <Skeleton loading={loading} active>
        <ProgressLink />
        <ProgressNum />
      </Skeleton>
      <ModalBox />
      <ChildComponent />
      <WujieChild props={{ showMessage, showMsgWithParentData, init }} />
    </div>
  );
};
