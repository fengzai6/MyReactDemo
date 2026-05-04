import type { ReactNode } from "react";

export interface IDemoRoute {
  path: string;
  name: string;
  description: string;
  tags: string[];
  element: ReactNode;
}

export interface ISingleRoute {
  path: string;
  element?: ReactNode;
}

export const demoRoutesMeta: Omit<IDemoRoute, "element">[] = [
  {
    path: "/demos/browser-tts",
    name: "Browser TTS",
    description: "基于 Web Speech API 的浏览器原生语音合成测试演示",
    tags: ["TTS", "Web Speech API", "语音合成"],
  },
  {
    path: "/demos/web-rtc",
    name: "WebRTC",
    description: "基于 WebRTC + WebSocket 的点对点音频通信演示",
    tags: ["WebRTC", "WebSocket", "P2P"],
  },
  {
    path: "/demos/web-socket",
    name: "WebSocket",
    description: "WebSocket 实时双向通信演示",
    tags: ["WebSocket", "实时通信"],
  },
  {
    path: "/demos/wujie",
    name: "WuJie 微前端",
    description: "基于 WuJie 的微前端主子应用通信、组件注册与扩展演示",
    tags: ["微前端", "WuJie", "跨应用通信"],
  },
  {
    path: "/demos/github",
    name: "GitHub OAuth",
    description: "GitHub OAuth 第三方登录演示",
    tags: ["OAuth", "GitHub", "鉴权"],
  },
  {
    path: "/demos/react19",
    name: "React 19",
    description: "React 19 新特性演示",
    tags: ["React", "React 19"],
  },
  {
    path: "/demos/html-to-pdf",
    name: "HTML to PDF",
    description: "HTML 内容导出为 PDF 文件演示",
    tags: ["PDF", "导出", "jsPDF"],
  },
  {
    path: "/demos/i18next",
    name: "i18next",
    description: "基于 i18next 的国际化演示，支持插值、复数、嵌套 key 等特性",
    tags: ["i18n", "i18next", "国际化"],
  },
  {
    path: "/demos/pretext",
    name: "Pretext",
    description: "基于 @chenglou/pretext 的文本布局与换行测量演示",
    tags: ["文本布局", "排版", "Canvas"],
  },
];
