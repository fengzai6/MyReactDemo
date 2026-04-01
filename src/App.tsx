import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import { AppLayout } from "@/components/app-layout";

function App() {
  return (
    <StyleProvider layer>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#2563eb",
          },
        }}
      >
        <AppLayout />
      </ConfigProvider>
    </StyleProvider>
  );
}

export default App;
