import React from "react";
import ContactList from "./ContactList";
import SendUsMessage from "../../Components/SendUsMessage";
import Banner from "../../Components/Banner";
import ContactImageBanner from "../../assets/images/banner/blog1.jpg";

const Contact = () => {
  return (
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
  );
};

export default Contact;
