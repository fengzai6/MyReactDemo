import { DemoNavCard } from "@/components/demo-nav-card";
import { demoRoutesMeta } from "@/router/routes";

export const Home = () => {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Demo Lab</h1>
        <p className="mt-2 text-gray-500">
          前端技术演示集合，涵盖微前端、实时通信、AI 应用等方向
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demoRoutesMeta.map((route) => (
          <DemoNavCard
            key={route.path}
            path={route.path}
            name={route.name}
            description={route.description}
            tags={route.tags}
          />
        ))}
      </div>
    </div>
  );
};
