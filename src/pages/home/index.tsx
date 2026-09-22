import { DemoNavCard } from "@/components/demo-nav-card";
import {
  DEMO_CATEGORY,
  DEMO_CATEGORY_LABEL,
  demoRoutesMeta,
  type DemoCategory,
} from "@/router/routes";

const CATEGORY_ORDER: DemoCategory[] = [
  DEMO_CATEGORY.LEARNING,
  DEMO_CATEGORY.TOOL,
];

export const Home = () => {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Demo Lab</h1>
        <p className="mt-2 text-gray-500">
          前端技术演示集合，涵盖微前端、实时通信、AI 应用等方向
        </p>
      </div>
      <div className="flex flex-col gap-8">
        {CATEGORY_ORDER.map((category) => (
          <section key={category}>
            <h2 className="mb-3 text-sm font-semibold tracking-widest text-gray-500 uppercase">
              {DEMO_CATEGORY_LABEL[category]}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {demoRoutesMeta
                .filter((route) => route.category === category)
                .map((route) => (
                  <DemoNavCard
                    key={route.path}
                    path={route.path}
                    name={route.name}
                    description={route.description}
                    tags={route.tags}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
