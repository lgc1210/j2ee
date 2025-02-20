import React from "react";
import Banner from "../../Components/Banner";
import ShopImageBanner from "../../assets/images/banner/uby-yanes-0ABufdkXgPI-unsplash-900x900.jpg";

const Shop = () => {
  return (
    <section>
      <div>
        <Banner
          imageBanner={ShopImageBanner}
          titleBanner='Shop'
          pathBanner='Shop'
        />
      </div>
    </section>
  );
};

export default Shop;
