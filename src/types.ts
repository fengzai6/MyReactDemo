import { Components } from "./pages/demo/wujie";

export interface WuJieState {
  loading: boolean;
  plugins: {
    name: string;
    url: string;
    comp?: Components;
  }[];
  components?: Record<string, Components>;
  context?: {
    [key: string]: any;
  } & {
    links: {
      name: string;
      url: string;
    }[];
  };
}
