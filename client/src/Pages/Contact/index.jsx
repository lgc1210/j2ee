import React, { lazy, Suspense } from "react";
import ContactImageBanner from "../../assets/images/banner/blog1.jpg";

const ContactList = lazy(() => import("./ContactList"));
const SendUsMessage = lazy(() => import("../../Components/SendUsMessage"));
const Banner = lazy(() => import("../../Components/Banner"));
const Loading = lazy(() => import("../../Components/Loading"));

const Contact = () => {
  return (
    <Suspense
      fallback={
        <Loading
          size='h-16 w-16'
          customStyle='w-full h-screen flex flex-col items-center justify-center'
          hasLoadingText
        />
      }>
      <section>
        <Banner
          imageBanner={ContactImageBanner}
          titleBanner='Contacts'
          pathBanner='Contacts'
        />
        <div className='md:py-36 py-28 md:px-0 px-6'>
          <div className='container mx-auto'>
            <div className='pb-36'>
              <ContactList />
            </div>
            <SendUsMessage />
          </div>
        </div>
      </section>
    </Suspense>
  );
};

export default Contact;
