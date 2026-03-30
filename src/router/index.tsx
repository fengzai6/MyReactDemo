import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router";
import App from "@/App";
import { Home } from "@/pages/home";

const WebRtcDemo = lazy(() =>
  import("@/demos/web-rtc").then((m) => ({ default: m.WebRtcDemo }))
);
const WebSocketDemo = lazy(() =>
  import("@/demos/web-socket").then((m) => ({ default: m.WebSocketDemo }))
);
const AiDrawDemo = lazy(() =>
  import("@/demos/ai-draw").then((m) => ({ default: m.AiDrawDemo }))
);
const WujieDemo = lazy(() =>
  import("@/demos/wujie").then((m) => ({ default: m.WujieDemo }))
);
const GithubDemo = lazy(() =>
  import("@/demos/github").then((m) => ({ default: m.GithubDemo }))
);
const React19Demo = lazy(() =>
  import("@/demos/react19").then((m) => ({ default: m.React19Demo }))
);
const HtmlToPdfDemo = lazy(() =>
  import("@/demos/html-to-pdf").then((m) => ({ default: m.HtmlToPdfDemo }))
);
const GithubCallback = lazy(() =>
  import("@/demos/github/Callback").then((m) => ({ default: m.GithubCallback }))
);
const NotFound = lazy(() =>
  import("@/pages/not-found").then((m) => ({ default: m.NotFound }))
);

const Loading = () => (
  <div className="flex h-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
  </div>
);

const demoRoutes: RouteObject[] = [
  { path: "web-rtc", element: <Suspense fallback={<Loading />}><WebRtcDemo /></Suspense> },
  { path: "web-socket", element: <Suspense fallback={<Loading />}><WebSocketDemo /></Suspense> },
  { path: "ai-draw", element: <Suspense fallback={<Loading />}><AiDrawDemo /></Suspense> },
  { path: "wujie", element: <Suspense fallback={<Loading />}><WujieDemo /></Suspense> },
  { path: "github", element: <Suspense fallback={<Loading />}><GithubDemo /></Suspense> },
  { path: "react19", element: <Suspense fallback={<Loading />}><React19Demo /></Suspense> },
  { path: "html-to-pdf", element: <Suspense fallback={<Loading />}><HtmlToPdfDemo /></Suspense> },
];

const baseRoutes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "demos", children: demoRoutes },
    ],
  },
  {
    path: "/oauth/github/callback",
    element: <Suspense fallback={<Loading />}><GithubCallback /></Suspense>,
  },
  {
    path: "*",
    element: <Suspense fallback={<Loading />}><NotFound /></Suspense>,
  },
];

export const Router = () => {
  return <RouterProvider router={createBrowserRouter(baseRoutes)} />;
};
