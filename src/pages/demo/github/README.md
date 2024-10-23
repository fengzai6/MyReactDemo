### 1、修改 clientId,redirectUri 的环境变量

将.env.example > .env 或者 .env.local

填写相关 oauth 信息

### 2、运行项目

```bash
yarn
yarn run dev
```

### 3、然后新建终端运行 server

运行 server 服务用于获取 token

```bash
cd ./src/pages/demo/github
node server.js
```
