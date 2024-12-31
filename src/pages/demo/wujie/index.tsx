import { Button, message, Modal, Skeleton } from "antd";
import WuJieReact from "wujie-react";
import { ChildComponent2 } from "./child-child";
import { LoadWujiePlugins } from "./LoadWujiePlugins";

import { useAppContext } from "@/app-context";
import { isValidElement, ReactNode, useEffect, useState } from "react";
import "./api";
import { Link } from "./Link";

const ChildComponent = () => {
  const { bus } = WuJieReact;

  useEffect(() => {
    // 不能使用匿名函数，否则无法解绑
    const onShowMessage = (msg: string) => {
      message.info(msg);
    };

    bus.$on("showMessage", onShowMessage);

    return () => {
      bus.$off("showMessage", onShowMessage);
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
  link?: (data: any) => ReactNode | null;
  links?: (data: any[]) => ReactNode | { title: string; url: string } | null;
  number?: (num: number) => {
    num: number;
    callback: Function;
  };
}

export interface IChildProps {
  showMessage: (msg: string) => void;
  showMsgWithParentData: (callback: (msg: string) => string) => void;
  register: (childName: string, comps: Components) => void;
  api: {
    getLinks: () => {
      url: string;
      name: string;
    }[];
  };
}

const Links = () => {
  const { wuJieState } = useAppContext();
  const [linkList, setLinkList] = useState<{ url: string; name: string }[]>([]);

  const api = {
    getLinks: () => {
      return wuJieState.context?.links;
    },
  };

  useEffect(() => {
    setLinkList(wuJieState.context?.links || []);
    console.log("links", wuJieState.context?.links);
  }, [wuJieState]);

  return (
    <div>
      <div className="my-4">和原 link 共存</div>
      {wuJieState.plugins.map((plugin) => {
        const links = plugin.comp?.links?.(linkList);

        const isComponent = isValidElement(links);

        const isPageData =
          typeof links === "object" && links?.title && links?.url;

        return (
          <div key={plugin.name}>
            <h3>
              {plugin.name} Links {linkList.length}
            </h3>
            {isComponent
              ? links
              : isPageData && (
                  <WuJieReact
                    name={links?.title}
                    url={plugin.url + links?.url}
                    props={{ api }}
                  />
                )}
          </div>
        );
      })}
      {linkList.map((item) => (
        <Link key={item.url} to={item.url}>
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export const WuJie = () => {
  const { bus } = WuJieReact;
  const { wuJieState, setWuJieState } = useAppContext();
  const [count, setCount] = useState(0);

  const showMessage = (msg: string) => {
    message.success(msg);
  };

  const showMsgWithParentData = (callback: (msg: string) => string) => {
    const msg = callback(`hello wujie with parent data ${count} | `);

    message.success(msg);
  };

  const linkList = [
    {
      url: "http://localhost:3057/",
      name: "link-name",
    },
    {
      url: "http://react.dev/",
      name: "react",
    },
    {
      url: "https://github.com",
      name: "github",
    },
    {
      url: "https://vitejs.dev",
      name: "vite",
    },
  ];

  const handlePushLink = () => {
    const newList = (wuJieState.context?.links || []).concat({
      url: "https://github.com/" + wuJieState.context?.links?.length,
      name: "github-" + wuJieState.context?.links?.length,
    });

    setWuJieState((prev) => ({
      ...prev,
      context: {
        ...prev.context,
        links: newList,
      },
    }));

    console.log("push link", newList);
    bus.$emit("contextUpdated", newList);
  };

  const data = {
    url: "http://localhost:3057/",
    name: "link-name",
  };

  const register = (childName: string, comps: Components) => {
    console.log("register", childName, comps);
    setWuJieState((prev) => ({
      ...prev,
      plugins: prev.plugins.map((plugin) => {
        if (plugin.name === childName) {
          return {
            ...plugin,
            comp: comps,
          };
        }
        return plugin;
      }),
      loading: false,
    }));
  };

  const api = {
    getLinks: () => {
      return linkList;
    },
  };

  // const Links = () => {
  //   return (
  //     <div>
  //       <div className="my-4">和原 link 共存</div>
  //       {wuJieState.plugins.map((plugin) => {
  //         const links = plugin.comp?.links?.(linkList);

  //         const isComponent = isValidElement(links);
  //         const isPageData =
  //           typeof links === "object" && links?.title && links?.url;

  //         return (
  //           <div key={plugin.name}>
  //             <h3>{plugin.name} Links</h3>
  //             {isComponent
  //               ? links
  //               : isPageData && (
  //                   <WuJieReact
  //                     name={links?.title}
  //                     url={plugin.url + links?.url}
  //                     props={{ api }}
  //                   />
  //                 )}
  //           </div>
  //         );
  //       })}
  //       {linkList.map((item) => (
  //         <Link key={item.url} to={item.url}>
  //           {item.name}
  //         </Link>
  //       ))}
  //     </div>
  //   );
  // };

  const ProgressLink = () => {
    const link = wuJieState.plugins
      .find((plugin) => plugin.name === "wujie-child")
      ?.comp?.link?.(data);

    if (link) {
      return link;
    } else {
      return <Link to={data.url}>{data.name}</Link>;
    }
  };

  const ProgressNum = () => {
    const [num, setNum] = useState(0);

    const number = wuJieState.plugins.find(
      (plugin) => plugin.name === "wujie-child"
    )?.comp?.number;

    if (number) {
      const { num: newNum, callback } = number(num);
      return (
        <div
          onClick={() => {
            callback?.();
            setNum(newNum);
          }}
        >
          {newNum}
        </div>
      );
    }
    return null;
  };

  const ModalBox = () => {
    const [visible, setVisible] = useState(false);

    return (
      <div>
        <Button
          onClick={() => {
            setVisible(true);
          }}
          className="my-8"
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
          <div>modal内显示子应用组件</div>
          <ProgressLink />
          <ProgressNum />
        </Modal>
      </div>
    );
  };

  useEffect(() => {
    console.log("components", wuJieState.plugins);
  }, [wuJieState]);

  return (
    <div>
      <h1>Main App</h1>
      <Button
        onClick={() => {
          setCount((prev) => prev + 1);
        }}
      >
        count: {count}
      </Button>
      <Button onClick={handlePushLink}>push link</Button>
      <Skeleton loading={wuJieState.loading} active>
        <div>替换原组件</div>
        <ProgressLink />
        <ProgressNum />
        <Links />
      </Skeleton>
      <ModalBox />
      <ChildComponent />
      <LoadWujiePlugins
        props={{ showMessage, showMsgWithParentData, register, api }}
      />
    </div>
  );
};
