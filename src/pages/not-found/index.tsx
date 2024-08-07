import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="box-border w-[24rem] h-[16rem] rounded-xl p-8 flex flex-col justify-center shadow-[0_0_10px_6px_#eaeaea]">
        <div className="text-[1.25rem] flex-1 flex flex-col items-center justify-center">
          <div className="text-[2.5rem] font-bold">404</div>
          <div className="font-bold">Page not found</div>
          <div>頁面不存在</div>
        </div>
        <div className="flex mt-4 justify-center items-center gap-4 h-[4rem]">
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
