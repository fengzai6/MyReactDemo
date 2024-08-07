### 1、运行项目

```bash
yarn
yarn run dev
```

### 2、然后新建终端运行 WebSocket

运行 WebSocket 服务用于创建信令服务

```bash
cd ./src/pages/demo/web-rtc
node ws.js
```

### 3、连接 ws 并开始直播

打开两个浏览器窗口，其中一个设置为发起方

![image.png](https://p1.meituan.net/csc/ac22443ef2db5b9110d8ab32df325eb117342.png)

两个窗口都点击连接 ws

![image.png](https://p0.meituan.net/csc/a0dcf86864ca960b97e85b158b072de422203.png)

然后由 `发起方 `点击开始直播即可开始

![image.png](https://p0.meituan.net/csc/ae5bc2c0433342d1058eba48147d0f29155298.png)
