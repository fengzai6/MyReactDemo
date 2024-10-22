export const GitHubDemo = () => {
  const clientId = "Ov23li29geIiaW6Xnsxe";

  const redirectUri = "http://localhost:3000/oauth/github/callback";

  const scopes = ["user", "repo"];

  const oAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    " "
  )}`;

  return (
    <div>
      <h1>GitHub Demo</h1>
      <a href={oAuthUrl}>Login with GitHub</a>
    </div>
  );
};
