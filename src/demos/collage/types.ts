export type TCollageMode = "v" | "h" | "g";

export type TCollageResizeMode = "native" | "fixed";

export interface ICollageImage {
  id: string;
  name: string;
  url: string;
  image: HTMLImageElement;
  width: number;
  height: number;
}

export interface ICollageSettings {
  mode: TCollageMode;
  resizeMode: TCollageResizeMode;
  cols: number;
  outSize: number;
  outScale: number;
  gap: number;
  radius: number;
  background: string;
  transparent: boolean;
  autoSize: boolean;
}

export interface ICollageLayoutBox {
  x: number;
  y: number;
  width: number;
  height: number;
  sourceX?: number;
  sourceY?: number;
  sourceWidth?: number;
  sourceHeight?: number;
  item: ICollageImage;
  selected?: boolean;
}

export interface ICollageLayout {
  boxes: ICollageLayoutBox[];
  width: number;
  height: number;
  scales: number[];
}

export type TCollageItemScales = Record<string, number>;

export interface ICollageRenderResult {
  canvasWidth: number;
  canvasHeight: number;
  imageScale: number;
}
