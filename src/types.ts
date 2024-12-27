import { Components } from "./pages/demo/wujie";

export interface WuJieState {
  loading: boolean;
  plugins: {
    name: string;
    url: string;
    comp?: Components;
  }[];
  components?: Record<string, Components>;
}
