import { useState, useEffect } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

const Link = ({ link, name }: { link: string; name: string }) => {
  return (
    <a href={link} target="_blank">
      <img src={viteLogo} className="logo" alt={name} />
    </a>
  );
};

function App() {
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState("");
  const [configData, setConfigData] = useState<any>(null);

  useEffect(() => {
    const onShowMsg = (m: string) => setMsg(m);
    window.$wujie?.bus.$on("showMsg", onShowMsg);

    fetch("http://localhost:1338/api/config")
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((data) => {
        setConfigData(data);
        console.log(data);
      })
      .catch((err) => {
        console.error("fetch error:", err);
      });

    return () => {
      window.$wujie?.bus.$off("showMsg", onShowMsg);
    };
  }, []);

  const planbanApi = window.$wujie.props;

  planbanApi?.init({
    link: (data) => {
      return <Link link={data.url} name={data.name} />;
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
      <h1>Vite + React</h1>
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
