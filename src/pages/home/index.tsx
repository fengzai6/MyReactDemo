import { routes } from "@/router/routes";
import { Button } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  return (
    <div className="h-screen">
      <div className="flex items-center gap-2 px-4 h-[4rem] backdrop-blur bg-white bg-opacity-60 sticky top-0 shadow z-50">
        {routes.map((item, index) => (
          <Button
            key={index}
            onClick={() => {
              navigate(item.path);
            }}
            className={pathname === item.path ? "text-blue-400 font-bold" : ""}
          >
            {item.name}
          </Button>
        ))}
      </div>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};
