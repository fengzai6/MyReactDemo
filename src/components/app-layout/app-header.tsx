import { useLocation } from "react-router";
import { demoRoutesMeta } from "@/router/routes";

export const AppHeader = () => {
  const { pathname } = useLocation();
  const current = demoRoutesMeta.find((r) => r.path === pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-6">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">
          {current?.name ?? "Demo Lab"}
        </span>
        {current?.description && (
          <span className="text-xs text-gray-500">{current.description}</span>
        )}
      </div>
      {current && (
        <div className="ml-auto flex gap-1.5">
          {current.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
};
