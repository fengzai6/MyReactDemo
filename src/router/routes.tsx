import { IRouteProps } from "./props";

import { WebRTCDemo } from "@/pages/demo/web-rtc";
import { WebSocketDemo } from "@/pages/demo/web-socket";
import { AiDraw } from "@/pages/demo/ai-draw";
import { WuJie } from "@/pages/demo/wujie";
import { GitHubDemo } from "@/pages/demo/github";
import { GitHubCallback } from "@/pages/demo/github/callback";

export const routes: IRouteProps[] = [
  {
    path: "/web-rtc",
    name: "WebRTC",
    element: <WebRTCDemo />,
  },
  {
    path: "/websocket",
    name: "WebSocket",
    element: <WebSocketDemo />,
  },
  {
    path: "/ai-draw",
    name: "AI Draw",
    element: <AiDraw />,
  },
  {
    path: "/wujie",
    name: "WuJie",
    element: <WuJie />,
  },
  {
    path: "/github",
    name: "GitHub",
    element: <GitHubDemo />,
  },
];

export const singleRoutes: IRouteProps[] = [
  {
    path: "/oauth/github/callback",
    name: "GitHub Callback",
    element: <GitHubCallback />,
  },
];
