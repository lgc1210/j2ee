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
          hasLoadingText
        />
      }>
      <Routes>
        {routes?.map(
          (
            {
              url,
              Layout,
              Page,
              isPublic,
              restrictAuthenticated,
              requiredRole,
            },
            index
          ) => {
            const RenderPage = (
              <ProtectedRoute
                restrictAuthenticated={restrictAuthenticated}
                isPublic={isPublic}
                requiredRole={requiredRole}>
                <Page />
              </ProtectedRoute>
            );

            return (
              <Route
                key={index}
                path={url}
                element={Layout ? <Layout>{RenderPage}</Layout> : RenderPage}
              />
            );
          }
        )}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
