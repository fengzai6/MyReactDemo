import { createContext, useContext, useState } from "react";
import { WuJieState } from "./types";

export interface IAppContext {
  wuJieState: WuJieState;
  setWuJieState: React.Dispatch<React.SetStateAction<WuJieState>>;
}

const AppContext = createContext<IAppContext>({} as IAppContext);

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [wuJieState, setWuJieState] = useState<WuJieState>({
    loading: false,
    plugins: [],
    components: {},
    context: {
      links: [
        {
          url: "http://localhost:3057/",
          name: "link-name",
        },
        {
          url: "http://react.dev/",
          name: "react",
        },
        {
          url: "https://github.com",
          name: "github",
        },
        {
          url: "https://vitejs.dev",
          name: "vite",
        },
      ],
    },
  });

  return (
    <AppContext.Provider
      value={{
        wuJieState,
        setWuJieState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
