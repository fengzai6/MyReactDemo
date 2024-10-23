import { Button, Card } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PreCode = ({ title, data }: { title: string; data: unknown }) => {
  return (
    <Card style={{ marginTop: 20 }}>
      <h2>{title}</h2>
      <pre
        style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
        className="max-h-96 overflow-y-auto"
      >
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </Card>
  );
};

interface IApiData {
  user: any;
  issues: any;
}

export const GitHubCallback = () => {
  const search = useLocation().search;

  const code = new URLSearchParams(search).get("code");

  const [accessToken, setAccessToken] = useState<string | null>();

  const [apiData, setApiData] = useState<IApiData>({
    user: null,
    issues: null,
  });

  const updateApiData = (
    key: keyof IApiData,
    data: IApiData[keyof IApiData]
  ) => {
    setApiData((prev) => ({ ...prev, [key]: data }));
  };

  const getAccessToken = async () => {
    // 向后端发送请求
    const res = await axios.post(`http://localhost:8080/api/oauth/github`, {
      code: code,
    });

    console.log(res);

    const data = await res.data;

    setAccessToken(data.access_token);
  };

  const getUser = async () => {
    const res = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(res);

    const data = res.data;

    updateApiData("user", data);
  };

  const getIssues = async () => {
    const res = await axios.get(
      "https://api.github.com/repos/fengzai6/myreactdemo/issues",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    console.log(res);

    updateApiData("issues", res.data);
  };

  // 通过postMessage发送消息到原窗口
  const sendMessage = (code: string) => {
    window.opener.postMessage(
      {
        source: "github-callback",
        code,
      },
      "http://localhost:3000"
    );
  };

  // 接受消息，关闭窗口
  const receiveMessage = (event: MessageEvent) => {
    if (event.origin !== "http://localhost:3000") {
      return;
    }

    if (event.data === "close") {
      window.close();
    }
  };

  useEffect(() => {
    if (code && window.opener) {
      sendMessage(code);
    }
  }, [code]);

  useEffect(() => {
    window.addEventListener("message", receiveMessage, false);

    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  return (
    <div>
      <h1>GitHub Callback</h1>
      <Button onClick={getAccessToken}>Get Access Token</Button>
      <Button onClick={getUser}>Get User</Button>
      <Button onClick={getIssues}>Get Issues</Button>
      <h2>Code: {code}</h2>
      <h2>Access Token: {accessToken}</h2>
      <PreCode title="user" data={apiData.user} />
      <PreCode title="issues" data={apiData.issues} />
    </div>
  );
};
