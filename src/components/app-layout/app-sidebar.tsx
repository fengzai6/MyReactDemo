import GithubIcon from "@/assets/icons/github.svg?react";
import { demoRoutesMeta } from "@/router/routes";
import { cn } from "@/utils/cn";
import { NavLink } from "react-router";

export const AppSidebar = () => {
  return (
    <aside className="flex h-full w-52 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-14 items-center justify-between border-b border-gray-200 px-5">
        <span className="text-sm font-semibold tracking-widest text-gray-700 uppercase">
          Demo Lab
        </span>
        <a
          href="https://github.com/fengzai6/MyReactDemo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 transition-colors hover:text-gray-900"
        >
          <GithubIcon />
        </a>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-5 py-2.5 text-sm transition-colors",
              isActive
                ? "bg-blue-50 font-medium text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            )
          }
        >
          首页
        </NavLink>
        <div className="my-1.5 border-t border-gray-100" />
        {demoRoutesMeta.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-5 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-blue-50 font-medium text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )
            }
          >
            {route.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
