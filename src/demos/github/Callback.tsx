import { Button, Card, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const PreCode = ({ title, data }: { title: string; data: unknown }) => (
  <Card style={{ marginTop: 20 }}>
    <h2>{title}</h2>
    <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }} className="max-h-96 overflow-y-auto">
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  </Card>
);

interface IApiData { user: unknown; issues: unknown; }

export const GithubCallback = () => {
  const search = useLocation().search;
  const code = new URLSearchParams(search).get("code");
  const [accessToken, setAccessToken] = useState<string | null>();
  const [apiData, setApiData] = useState<IApiData>({ user: null, issues: null });

  const updateApiData = (key: keyof IApiData, data: IApiData[keyof IApiData]) => {
    setApiData((prev) => ({ ...prev, [key]: data }));
  };

  const getAccessToken = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/api/oauth/github`, { code });
      setAccessToken(res.data.access_token);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        void message.error(error.response.data.message);
      } else {
        void message.error("server服务可能未运行");
      }
    }
  };

  const getUser = async () => {
    const res = await axios.get("https://api.github.com/user", { headers: { Authorization: `Bearer ${accessToken}` } });
    updateApiData("user", res.data);
  };

  const getIssues = async () => {
    const res = await axios.get("https://api.github.com/repos/fengzai6/myreactdemo/issues", {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
    });
    updateApiData("issues", res.data);
  };

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ source: "github-callback", code }, "http://localhost:3000");
    }
  }, [code]);

  return (
    <div className="p-4">
      <h2>Code: {code}</h2>
      <h2>Access Token: {accessToken}</h2>
      <Button onClick={getAccessToken}>Get Access Token</Button>
      <Button onClick={getUser} disabled={!accessToken}>Get User</Button>
      <Button onClick={getIssues} disabled={!accessToken}>Get Issues</Button>
      <PreCode title="user" data={apiData.user} />
      <PreCode title="issues" data={apiData.issues} />
    </div>
  );
};
