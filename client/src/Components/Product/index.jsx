import React, { lazy, Suspense } from "react";
import { BsCartPlus } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import paths from "../../Constants/paths";

const Loading = lazy(() => import("../../Components/Loading"));

const Product = ({ product }) => {
  const navigate = useNavigate();

  const handleNavigateToProductDetails = (productId, event) => {
    event.stopPropagation();
    navigate(paths.productDetails, { state: { productId } });
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
      <li key={product?.id}>
        <div
          className='cursor-pointer relative group mb-6'
          onClick={(event) =>
            handleNavigateToProductDetails(product?.id, event)
          }>
          <img
            src={product?.image}
            alt={product?.name}
            className='w-full h-full obejct-center object-cover'
          />

          {/* Sale */}
          {product?.isSale && (
            <div className='absolute top-4 left-4'>
              <p className='text-white bg-black px-2 py-3 text-center align-middle rounded-full'>
                Sale!
              </p>
            </div>
          )}

          {/* Add to cart */}
          <div className='transition-all duration-700 group-hover:opacity-100 opacity-0 cursor-pointer bg-[#779AA1] p-2.5 absolute top-1/2 left-1/2 -translate-x-1/2 group-hover:-translate-y-1/2 rounded-full'>
            <BsCartPlus size={24} className='text-white' />
          </div>
        </div>

        <div className='text-center'>
          <p
            className='text-2xl mb-2 font-serif cursor-pointer hover:text-[#779AA1] transition-all duration-700'
            onClick={(event) =>
              handleNavigateToProductDetails(product?.id, event)
            }>
            {product?.name}
          </p>
          <span className='flex items-center justify-center gap-2'>
            {product?.oldPrice && (
              <p className='text-zinc-400 line-through font-serif'>
                ${product?.oldPrice}
              </p>
            )}
            <p className='text-zinc-600 text-2xl font-serif'>
              ${product?.price}
            </p>
          </span>
        </div>
      </li>
    </Suspense>
  );
};

export default Product;
