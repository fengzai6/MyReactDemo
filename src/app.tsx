import { App as AppWrapper, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { Router } from "./router";

export const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <AppWrapper>
        <Router />
      </AppWrapper>
    </ConfigProvider>
  );
};
