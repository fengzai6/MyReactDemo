import { IRouteProps } from "./props";

import { WebRTCDemo } from "@/pages/demo/web-rtc";
import { WebSocketDemo } from "@/pages/demo/web-socket";

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
];
