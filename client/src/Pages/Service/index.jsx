import React from "react";
import Banner from "../../Components/Banner";
import ServiceImageBanner from "../../assets/images/banner/young-woman-visiting-masseur-spa-center.jpg";

const Service = () => {
  return (
    <section>
      <div>
        <Banner
          imageBanner={ServiceImageBanner}
          titleBanner='Service'
          pathBanner='Service'
        />
      </div>
    </section>
  );
};

export default Service;
