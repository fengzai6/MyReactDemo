import { App as AppWrapper, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { AppProvider } from "./app-context";
import { Router } from "./router";

export const App = () => {
  return (
    <AppProvider>
      <ConfigProvider locale={zhCN}>
        <AppWrapper>
          <Router />
        </AppWrapper>
      </ConfigProvider>
    </AppProvider>
  );
};
