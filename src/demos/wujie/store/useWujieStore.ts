import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type { IWuJieComponents, IWuJieLink, IWuJiePlugin, IWuJieState } from "../types";
import { CHILD_APPS, DEFAULT_LINKS } from "../constants";

interface IWujieStore extends IWuJieState {
  setLoading: (loading: boolean) => void;
  initPlugins: () => void;
  registerPluginComponents: (childName: string, comps: IWuJieComponents) => void;
  appendLink: (link: IWuJieLink) => void;
}

export const useWujieStore = create<IWujieStore>((set) => ({
  loading: false,
  plugins: [],
  contextLinks: DEFAULT_LINKS,

  setLoading: (loading) => set({ loading }),

  initPlugins: () =>
    set((state) => {
      if (state.plugins.length) return state;
      const plugins: IWuJiePlugin[] = CHILD_APPS.map((app) => ({
        name: app.name,
        url: app.url,
      }));
      return { plugins };
    }),

  registerPluginComponents: (childName, comps) =>
    set((state) => ({
      loading: false,
      plugins: state.plugins.map((p) =>
        p.name === childName ? { ...p, comp: comps } : p
      ),
    })),

  appendLink: (link) =>
    set((state) => ({
      contextLinks: [...state.contextLinks, link],
    })),
}));

export const useWujieState = () =>
  useWujieStore(
    useShallow((s) => ({
      loading: s.loading,
      plugins: s.plugins,
      contextLinks: s.contextLinks,
    }))
  );
