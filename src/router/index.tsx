import { Fragment } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { IRouteProps } from "./props";
import { routes, singleRoutes } from "./routes";

import { Home } from "@/pages/home";
import { NotFound } from "@/pages/not-found";

export const Router = () => {
  const routerViews = (routes: IRouteProps[]) => {
    return routes.map((item: IRouteProps, index: number) => (
      <Fragment key={index}>
        {item.index && (
          <Route index element={<Navigate to={item.path} replace />} />
        )}
        <Route path={item.path} element={item.element}>
          {item.children && routerViews(item.children)}
        </Route>
      </Fragment>
    ));
  };

  return (
    <Routes>
      <Route path="/" element={<Home />}>
        {routerViews(routes)}
      </Route>
      {routerViews(singleRoutes)}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
