// 一个简单的node服务，监听8080端口，用于接收前端的code，并使用axios请求github的access_token返回给前端
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

const app = express();
const port = 8080;

const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
const clientSecret = import.meta.env.VITE_GITHUB_CLIENT_SECRET;
const redirectUri = "http://localhost:3000/oauth/github/callback";

app.use(bodyParser.json());
app.use(cors());

app.post("/api/oauth/github", async (req, res) => {
  const { code } = req.body;

  console.log("Received code:", code);

  try {
    /**
     * Get access token
     * 获取访问令牌不能同源，所以需要在后端代理请求，而且用不了 fetch，因为 fetch 不能跨域？
     */
    const response = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = response.data;
    console.log("response:", response.data);

    if (data.error) {
      throw new Error(data.error_description);
    }

    // 所返回data格式是 { access_token: 'xxx', token_type: 'bearer', scope: 'xxx' }

    res.json(data);
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
