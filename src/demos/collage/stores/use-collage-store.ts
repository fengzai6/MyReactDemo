import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ICollageSettings } from "../types";

export const DEFAULT_COLLAGE_SETTINGS: ICollageSettings = {
  mode: "v",
  resizeMode: "native",
  cols: 2,
  outSize: 1080,
  outScale: 1,
  gap: 12,
  radius: 0,
  background: "#ffffff",
  transparent: false,
  autoSize: false,
};

interface ICollageStore {
  settings: ICollageSettings;
  updateSettings: (
    updater: (settings: ICollageSettings) => ICollageSettings,
  ) => void;
}

export const useCollageStore = create<ICollageStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_COLLAGE_SETTINGS,
      updateSettings: (updater) =>
        set((state) => ({
          settings: updater(state.settings),
        })),
    }),
    {
      name: "collage-settings",
      partialize: (state) => ({
        settings: state.settings,
      }),
    },
  ),
);
