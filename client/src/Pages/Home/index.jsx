import React from "react";
import Hero from "../../Components/Hero";
import About from "../../Components/About";
import Features from "../../Components/Features";
import Works from "../../Components/Works";
import Feedback from "../../Components/Feedback";

const Home = () => {
  return (
    <section className='overflow-hidden'>
      <Hero />
      <About />
      <Features />
      <Works />
      <Feedback />
    </section>
  );
};

export default Home;
