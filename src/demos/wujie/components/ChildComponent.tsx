import { message } from "antd";
import { useEffect } from "react";
import WujieReact from "wujie-react";

export const ChildComponent = () => {
  const { bus } = WujieReact;

  useEffect(() => {
    const onShowMessage = (msg: string) => {
      void message.info(msg);
    };
    bus.$on("showMessage", onShowMessage);
    return () => {
      bus.$off("showMessage", onShowMessage);
    };
  }, [bus]);

  return (
    <div>
      <ChildComponent2 />
      Main App Child Component
    </div>
  );
};

const ChildComponent2 = () => {
  const { bus } = WujieReact;

  useEffect(() => {
    const onShowMessage = (msg: string) => {
      void message.info(msg + " from child component");
    };
    bus.$on("showMessage", onShowMessage);
    return () => {
      bus.$off("showMessage", onShowMessage);
    };
  }, [bus]);

  return <span className="text-blue-300">Child Component</span>;
};
