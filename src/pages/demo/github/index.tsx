import { Button, Space } from "antd";
import { useNewWindow } from "./use-new-window";

export const GitHubDemo = () => {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

  const redirectUri = "http://localhost:3000/oauth/github/callback";

  const scopes = ["repo", "read:user"];

  const oAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    " "
  )}`;

  const { openWindow } = useNewWindow(oAuthUrl);

  return (
    <div className="p-4">
      <h1>GitHub Demo</h1>
      <Space>
        <a href={oAuthUrl}>
          <Button>Login with GitHub</Button>
        </a>
        <Button onClick={openWindow}>Login with GitHub on Popup Window</Button>
      </Space>
    </div>
  );
};
