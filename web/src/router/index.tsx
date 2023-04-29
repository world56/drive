import { Suspense } from 'react';
import routes from './paths/public';
import Loading from './components/Loading';
import { Route, createRoutesFromElements, createBrowserRouter } from "react-router-dom";

import type { TypeRoute } from '@/interface/route';

const loadAsyncRoutes = (routes: TypeRoute.Route[]) => (
  routes.map(r => <Route
    key={r.path}
    path={r.path!}
    loader={r.loader}
    errorElement={r.errorElement}
    element={
      <Suspense fallback={<Loading />}>
        <r.element />
      </Suspense>
    }>
    {r.children?.length ? loadAsyncRoutes(r.children) : null}
  </Route>)
);

const asyncRoutes = loadAsyncRoutes(routes);
const transform = createRoutesFromElements(asyncRoutes);
export default createBrowserRouter(transform);
