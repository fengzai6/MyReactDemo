import type { ReactNode } from "react";

export interface IWuJieLink {
  url: string;
  name: string;
}

export interface IWuJieComponents {
  link?: (data: IWuJieLink) => ReactNode | null;
  links?: (data: IWuJieLink[]) => ReactNode | IWujieLinksPageData | null;
  number?: (num: number) => IWujieNumberResult;
}

export interface IWujieLinksPageData {
  title: string;
  url: string;
}

export interface IWujieNumberResult {
  num: number;
  callback: () => void;
}

export interface IWuJiePlugin {
  name: string;
  url: string;
  comp?: IWuJieComponents;
}

export interface IWuJieState {
  loading: boolean;
  plugins: IWuJiePlugin[];
  contextLinks: IWuJieLink[];
}

export interface IWuJieChildProps {
  showMessage: (msg: string) => void;
  showMsgWithParentData: (callback: (msg: string) => string) => void;
  register: (childName: string, comps: IWuJieComponents) => void;
  api: {
    getLinks: () => IWuJieLink[];
  };
}
