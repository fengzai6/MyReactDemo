import { useEffect, useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

export const Link = ({ link, name }: { link: string; name: string }) => {
  return (
    <a
      href={link}
      target="_blank"
      style={{
        backgroundColor: "slategray",
        color: "white",
        fontWeight: "bold",
        padding: "0.5rem 1rem",
        borderRadius: "0.25rem",
        display: "flex",
        alignItems: "center",
        width: "fit-content",
      }}
    >
      <img src={reactLogo} alt={name} style={{ marginRight: "0.5rem" }} />
      <span>{name}</span>
    </a>
  );
};

// const SpecialLink = ({
//   links,
//   state,
// }: {
//   links: { url: string; name: string }[];
//   state: number;
// }) => {
//   // filter仅数组中当链接是 github 时，显示该链接
//   const githubLink = links.filter((item) => item.name === "github");

//   // const [count, setCount] = useState(0);

//   // 未来使用 ts-patterns 进行匹配，分别处理 pr、issue等链接，并调用接口获取状态

//   return (
//     <>
//       {githubLink.map((item) => (
//         <>
//           <Link
//             key={item.url}
//             link={item.url}
//             name={item.name + "+state:" + state}
//           />
//           {/* <button onClick={() => setCount((count) => count + 1)}>
//             private count is {count}
//           </button> */}
//         </>
//       ))}
//     </>
//   );
// };

function App() {
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState("");

  const planbanApi = window.$wujie.props;

  planbanApi?.register("wujie-child-2", {
    link: (data) => {
      return <Link link={data.url} name={data.name} />;
    },
    links: () => {
      return {
        title: "Special Links",
        url: "/special-links",
      };
      // return <SpecialLink links={data} state={count} />;
    },
    number: (num) => {
      const callback = () => {
        return window.$wujie.props?.showMessage(
          "hello wujie with props method"
        );
      };
      return { num: num + 1, callback };
    },
  });

  useEffect(() => {
    const onShowMsg = (m: string) => setMsg(m);
    window.$wujie?.bus.$on("showMsg", onShowMsg);

    return () => {
      window.$wujie?.bus.$off("showMsg", onShowMsg);
    };
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>I'm Children Web No.2</h1>
      <div className="card">
        <button
          onClick={() => {
            if (window.$wujie) {
              window.$wujie.bus.$emit("showMessage", "hello wujie");
            }
          }}
        >
          show main app bus
        </button>
        <button
          onClick={() => {
            if (window.$wujie) {
              window.$wujie.props?.showMessage("hello wujie with props method");
              window.$wujie.props?.showMsgWithParentData((msg: string) => {
                return msg + " with parent data";
              });
            }
          }}
        >
          show main app props
        </button>
        <div
          onClick={() => {
            window.$wujie.bus.$emit("getMsg");
          }}
        >
          getMsg
        </div>
        <p>{msg}</p>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
