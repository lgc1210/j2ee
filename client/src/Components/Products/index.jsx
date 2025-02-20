import React from "react";
import Product from "../Product";

const sampleData = [
  {
    id: 1,
    name: "Beaty Care",
    image:
      "https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod2-800x800.jpg",
    price: "59.00",
    isSale: false,
  },
  {
    id: 2,
    name: "Cosmetic Splash",
    image:
      "https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod4-800x800.jpg",
    oldPrice: "99.00",
    price: "79.00",
    isSale: true,
  },
  {
    id: 3,
    name: "Cream Package",
    image:
      "https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod5-800x800.jpg",
    price: "89.00",
    isSale: false,
  },
  {
    id: 4,
    name: "Face Cream Winter",
    image:
      "https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod1-800x800.jpg",
    oldPrice: "99.00",
    price: "79.00",
    isSale: true,
  },
];

const Products = () => {
  return (
    <ul className='grid lg:grid-cols-3 md:grid-cols-2 gap-12'>
      {sampleData.map((product) => {
        return <Product key={product?.id} product={product} />;
      })}
    </ul>
  );
};

export default Products;
