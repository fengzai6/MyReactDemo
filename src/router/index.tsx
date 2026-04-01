import { lazy, Suspense, type ReactNode } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router";
import App from "@/App";
import { Home } from "@/pages/home";

const WebRtcDemo = lazy(() =>
  import("@/demos/web-rtc").then((m) => ({ default: m.WebRtcDemo })),
);
const WebSocketDemo = lazy(() =>
  import("@/demos/web-socket").then((m) => ({ default: m.WebSocketDemo })),
);
const WujieDemo = lazy(() =>
  import("@/demos/wujie").then((m) => ({ default: m.WujieDemo })),
);
const GithubDemo = lazy(() =>
  import("@/demos/github").then((m) => ({ default: m.GithubDemo })),
);
const React19Demo = lazy(() =>
  import("@/demos/react19").then((m) => ({ default: m.React19Demo })),
);
const HtmlToPdfDemo = lazy(() =>
  import("@/demos/html-to-pdf").then((m) => ({ default: m.HtmlToPdfDemo })),
);
const Pretext = lazy(() =>
  import("@/demos/pretext").then((m) => ({ default: m.Pretext })),
);
const GithubCallback = lazy(() =>
  import("@/demos/github/Callback").then((m) => ({
    default: m.GithubCallback,
  })),
);
const NotFound = lazy(() =>
  import("@/pages/not-found").then((m) => ({ default: m.NotFound })),
);

const Loading = () => (
  <div className="flex h-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
  </div>
);

const wrapWithSuspense = (element: ReactNode) => (
  <Suspense fallback={<Loading />}>{element}</Suspense>
);

const demoRoutes: RouteObject[] = [
  { path: "web-rtc", element: <WebRtcDemo /> },
  { path: "web-socket", element: <WebSocketDemo /> },
  { path: "wujie", element: <WujieDemo /> },
  { path: "github", element: <GithubDemo /> },
  { path: "react19", element: <React19Demo /> },
  { path: "html-to-pdf", element: <HtmlToPdfDemo /> },
  { path: "pretext", element: <Pretext /> },
];

const demoRouteChildren: RouteObject[] = demoRoutes.map(
  ({ path, element }) => ({
    path,
    element: wrapWithSuspense(element),
  }),
);

const baseRoutes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "demos", children: demoRouteChildren },
    ],
  },
  {
    path: "/oauth/github/callback",
    element: wrapWithSuspense(<GithubCallback />),
  },
  {
    path: "*",
    element: wrapWithSuspense(<NotFound />),
  },
];

export const Router = () => {
  return <RouterProvider router={createBrowserRouter(baseRoutes)} />;
};
