import { message } from "antd";
import { useEffect } from "react";
import WujieReact from "wujie-react";

export const ChildComponent2 = () => {
  const { bus } = WujieReact;

  useEffect(() => {
    const onShowMessage = (msg: string) => {
      message.info(msg + " from child component");
    };

    bus.$on("showMessage", onShowMessage);

    return () => {
      bus.$off("showMessage", onShowMessage);
    };
  }, [bus]);

  return <span className="text-blue-300">Child Component</span>;
};
