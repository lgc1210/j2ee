import React, { lazy, Suspense } from "react";

const SortingProduct = lazy(() => import("../SortingProduct"));
const Loading = lazy(() => import("../../Components/Loading"));
const Products = lazy(() => import("../Products"));

const ProductList = () => {
  return (
    <Suspense
      fallback={
        <Loading
          size='h-16 w-16'
          customStyle='w-full h-screen flex flex-col items-center justify-center'
          hasLoadingText
        />
      }>
      <section>
        <div className='mb-8'>
          <SortingProduct />
        </div>
        <div>
          <Products />
        </div>
      </section>
    </Suspense>
  );
};

export default React.memo(ProductList);
