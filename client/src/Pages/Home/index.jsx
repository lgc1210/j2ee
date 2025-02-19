import React from "react";
import Hero from "../../Components/Hero";
import About from "../../Components/About";
import Features from "../../Components/Features";
import Works from "../../Components/Works";

const Home = () => {
  return (
    <section className='overflow-hidden'>
      <Hero />
      <About />
      <Features />
      <Works />
    </section>
  );
};

export default Home;
