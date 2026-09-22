import {
  ApiOutlined,
  AppstoreOutlined,
  AudioOutlined,
  CodeOutlined,
  FilePdfOutlined,
  FontSizeOutlined,
  GithubOutlined,
  GlobalOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PhoneOutlined,
  PictureOutlined,
  ReadOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Button, Menu, Tooltip, type MenuProps } from "antd";
import GithubIcon from "@/assets/icons/github.svg?react";
import {
  DEMO_CATEGORY,
  DEMO_CATEGORY_LABEL,
  demoRoutesMeta,
  type DemoCategory,
} from "@/router/routes";
import { useAppStore } from "@/stores/use-app-store";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";

const CATEGORY_ORDER: DemoCategory[] = [
  DEMO_CATEGORY.LEARNING,
  DEMO_CATEGORY.TOOL,
];

const CATEGORY_ICON: Record<DemoCategory, ReactNode> = {
  [DEMO_CATEGORY.LEARNING]: <ReadOutlined />,
  [DEMO_CATEGORY.TOOL]: <ToolOutlined />,
};

const DEMO_ICON: Record<string, ReactNode> = {
  "/demos/browser-tts": <AudioOutlined />,
  "/demos/web-rtc": <PhoneOutlined />,
  "/demos/web-socket": <ApiOutlined />,
  "/demos/wujie": <AppstoreOutlined />,
  "/demos/github": <GithubOutlined />,
  "/demos/react19": <CodeOutlined />,
  "/demos/html-to-pdf": <FilePdfOutlined />,
  "/demos/i18next": <GlobalOutlined />,
  "/demos/pretext": <FontSizeOutlined />,
  "/demos/collage": <PictureOutlined />,
};

export const AppSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const collapsed = useAppStore((state) => state.sidebarCollapsed);
  const setSidebarCollapsed = useAppStore(
    (state) => state.setSidebarCollapsed,
  );

  const menuItems: MenuProps["items"] = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "首页",
    },
    { type: "divider" },
    ...CATEGORY_ORDER.map((category) => ({
      key: category,
      icon: CATEGORY_ICON[category],
      label: DEMO_CATEGORY_LABEL[category],
      children: demoRoutesMeta
        .filter((route) => route.category === category)
        .map((route) => ({
          key: route.path,
          icon: DEMO_ICON[route.path],
          label: route.name,
        })),
    })),
  ];

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-gray-200 bg-white transition-[width] duration-200",
        collapsed ? "w-20" : "w-52",
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-gray-200",
          collapsed ? "justify-center px-2" : "justify-between px-3 pl-5",
        )}
      >
        {!collapsed && (
          <>
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
          </>
        )}
        <Tooltip title={collapsed ? "展开侧栏" : "收起侧栏"}>
          <Button
            type="text"
            size="small"
            aria-label={collapsed ? "展开侧栏" : "收起侧栏"}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setSidebarCollapsed(!collapsed)}
          />
        </Tooltip>
      </div>
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        items={menuItems}
        defaultOpenKeys={CATEGORY_ORDER}
        selectedKeys={[pathname]}
        onClick={({ key }) => navigate(key)}
        className="flex-1 overflow-y-auto border-r-0! pt-2"
      />
    </aside>
  );
};
