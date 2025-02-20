import React from "react";
import SortingProduct from "../SortingProduct";
import Products from "../Products";

const ProductList = () => {
  return (
    <section>
      <div className='mb-8'>
        <SortingProduct />
      </div>
      <div>
        <Products />
      </div>
    </section>
  );
};

export default ProductList;
