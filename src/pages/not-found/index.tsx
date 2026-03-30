import { Button } from "antd";
import { useNavigate } from "react-router";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="box-border flex h-64 w-96 flex-col justify-center rounded-xl border border-gray-200 p-8 shadow-md">
        <div className="flex flex-1 flex-col items-center justify-center text-xl">
          <div className="text-5xl font-bold text-gray-800">404</div>
          <div className="font-bold text-gray-700">Page not found</div>
          <div className="text-gray-500">頁面不存在</div>
        </div>
        <div className="mt-4 flex h-16 items-center justify-center gap-4">
          <Button className="w-2/6 rounded-full" onClick={() => navigate(-1)}>
            返回
          </Button>
          <Button
            type="primary"
            className="w-2/6 rounded-full"
            onClick={() => navigate("/")}
          >
            回首页
          </Button>
        </div>
      </div>
    </div>
  );
};
