import React from "react";
import Banner from "../../Components/Banner";
import ShopImageBanner from "../../assets/images/banner/uby-yanes-0ABufdkXgPI-unsplash-900x900.jpg";
import FilterProduct from "../../Components/FilterProduct";
import ProductList from "../../Components/ProductList";

const Shop = () => {
  return (
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
  );
};

export default Shop;
