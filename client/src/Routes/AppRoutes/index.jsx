import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "../../Components/Loading";
import routes from "..";
import ProtectedRoute from "../ProtectedRoute";

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <Loading
          size='h-16 w-16'
          customStyle='w-full h-screen flex flex-col items-center justify-center'
        />
      }>
      <Routes>
        {Object.values(routes).map(({ url, Layout, Page, isPublic }, index) => {
          const RenderPage = isPublic ? (
            <Page />
          ) : (
            <ProtectedRoute>
              <Page />
            </ProtectedRoute>
          );

          return Layout ? (
            <Route key={index} path={url} element={<Layout />}>
              <Route index element={RenderPage} />
            </Route>
          ) : (
            <Route key={index} path={url} element={RenderPage} />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
