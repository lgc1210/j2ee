import React, { lazy, Suspense, useState } from "react";
import ShopImageBanner from "../../assets/images/banner/uby-yanes-0ABufdkXgPI-unsplash-900x900.jpg";

const FilterProduct = lazy(() => import("../../Components/FilterProduct"));
const ProductList = lazy(() => import("../../Components/ProductList"));
const Loading = lazy(() => import("../../Components/Loading"));
const StoresChoosingWrap = lazy(() =>
  import("../../Components/StoresChoosingWrap")
);
const Banner = lazy(() => import("../../Components/Banner"));

const Shop = () => {
  const [showShop, setShowShop] = useState(false);

  const handleSelectStore = () => {
    setShowShop(true);
  };

  return (
    <Suspense
      fallback={
        <Loading
          size='h-16 w-16'
          customStyle='w-full h-screen flex flex-col items-center justify-center'
          hasLoadingText
        />
      }>
      {showShop ? (
        <section>
          <Banner
            imageBanner={ShopImageBanner}
            titleBanner='Shop'
            pathBanner='Shop'
          />

          <div className='md:py-36 py-28 md:px-0 px-6'>
            <div className='container mx-auto'>
              <div className='grid md:grid-cols-5 gap-16'>
                <div>
                  <FilterProduct />
                </div>
                <div className='md:col-span-4'>
                  <ProductList />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <StoresChoosingWrap handleSelectStore={handleSelectStore} />
      )}
    </Suspense>
  );
};

export default Shop;
