import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/header/lesya-logo.png";
import navItems from "./navItems";
import paths from "../../Constants/paths";

import { IoIosArrowDown } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { HiSearch } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiOutlineBars3 } from "react-icons/hi2";

const Header = () => {
  const navigate = useNavigate();
  const [toggleNav, setToggleNav] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;
    const sticky = header.offsetHeight;

    const handleScroll = () => {
      setIsSticky(window.pageYOffset > sticky);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (path, haveChidlren = false) => {
    if (!haveChidlren) navigate(path);
  };

  return (
    <header
      className={`md:px-14 px-6 shadow w-full h-24 z-30 bg-white ${
        isSticky ? "sticky top-0 right-0 left-0" : "relative"
      }`}
      ref={headerRef}>
      <div className='h-full flex items-center justify-between md:flex-wrap flex-nowrap'>
        {/* Small screens */}
        <HiOutlineBars3
          size={30}
          className='md:hidden block cursor-pointer'
          onClick={() => setToggleNav(!toggleNav)}
        />

        <div
          className='md:order-1 order-2 cursor-pointer'
          onClick={() => navigate(paths.home)}>
          <img
            src={Logo}
            alt='Logo'
            className='max-w-40 h-full object-contain object-center'
          />
        </div>

        <nav
          className={`transition-all durtaion-500 md:py-0 py-8 bg-white lg:order-2 md:order-3 order-1 md:flex-row md:relative md:top-0 absolute z-20 top-full right-0 left-0 flex-col items-center justify-center xl:gap-16 gap-4 xl:px-0 px-8 ${
            toggleNav ? "flex" : "hidden"
          }`}>
          {navItems.map((item, index) => {
            return (
              <div
                key={index}
                className='xl:text-lg relative group'
                onClick={() => handleNavigation(item?.path, item?.children)}>
                <span className='uppercase cursor-pointer font-sans text-lg flex items-center justify-center gap-2 transition-all duration-500 group-hover:text-[#799AA1]'>
                  <p>{item.name}</p>
                  {item?.children && <IoIosArrowDown />}
                </span>

                {/* Sub nav */}
                {item?.children && (
                  <div className='md:bg-white bg-gray-200 cursor-pointer text-md md:max-w-xl md:w-80 w-screen hidden md:absolute md:top-full shadow transition-all duration-500 group-hover:block'>
                    {item.children.map((childItem, index) => {
                      return (
                        <div
                          key={index}
                          className='py-2 px-4 border-t hover:text-[#799AA1] transition-all duration-500 w-full'
                          onClick={() =>
                            handleNavigation(
                              childItem?.path,
                              childItem?.children
                            )
                          }>
                          {childItem.name}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className='order-3 md:order-2 flex items-center justify-center md:gap-8 gap-4'>
          <div className='relative'>
            <FaCartShopping size={24} className='cursor-pointer' />
            <span className='text-center leading-tight absolute -top-4 -right-4 bg-[#799AA1] text-white min-w-5 h-auto rounded-full'>
              1
            </span>
          </div>
          <div className='md:block hidden'>
            <HiSearch size={24} className='cursor-pointer' />
          </div>
          <div>
            <BsThreeDotsVertical size={24} className='cursor-pointer' />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
