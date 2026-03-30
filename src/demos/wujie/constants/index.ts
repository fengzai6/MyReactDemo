import type { IWuJieLink } from "../types";

export const DEFAULT_LINKS: IWuJieLink[] = [
  { url: "http://localhost:3057/", name: "link-name" },
  { url: "http://react.dev/", name: "react" },
  { url: "https://github.com", name: "github" },
  { url: "https://vitejs.dev", name: "vite" },
];

export const CHILD_APPS = [
  {
    name: "wujie-child-2",
    url: "http://localhost:3058",
  },
] as const;
