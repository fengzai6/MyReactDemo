import { IRouteProps } from "./props";

import { WebRTCDemo } from "@/pages/demo/web-rtc";
import { WebSocketDemo } from "@/pages/demo/web-socket";
import { AiDraw } from "@/pages/demo/ai-draw";

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
];
