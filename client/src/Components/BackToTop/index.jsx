import React, { useEffect, useState } from "react";
import Button from "../../Components/Button";
import { IoIosArrowUp } from "react-icons/io";

const BackToTop = () => {
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    const showBackToTopButton = () => {
      if (window.scrollY > 300) {
        setIsButtonVisible(true);
      } else {
        setIsButtonVisible(false);
      }
    };

    window.addEventListener("scroll", showBackToTopButton);

    return () => {
      window.removeEventListener("scroll", showBackToTopButton);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      Icon={IoIosArrowUp}
      iconSize={20}
      iconStyle='text-white'
      buttonStyle={`[&]:border-black/50 [&]:p-2 shadow [&]:rounded-md [&]:fixed bottom-6 right-6 [&]:bg-black/50 ${
        isButtonVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={scrollToTop}
    />
  );
};

export default BackToTop;
