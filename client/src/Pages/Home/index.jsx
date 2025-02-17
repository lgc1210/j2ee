import React from "react";
import Hero from "../../Components/Hero";
import About from "../../Components/About";
import Features from "../../Components/Features";

const Home = () => {
  return (
    <section className='overflow-hidden'>
      <Hero />
      <About />
      <Features />
    </section>
  );
};

export default Home;
