import paths from "../../Constants/paths";

const navItems = [
  {
    name: "Home",
    path: paths.home,
    children: [
      { name: "Beauty Salon", path: paths.home },
      { name: "Spa", path: paths.home },
      { name: "Hair Salon", path: paths.home },
    ],
  },
  {
    name: "Booking",
    path: paths.home,
    children: [
      { name: "Appointment Booking Calendar", path: paths.home },
      { name: "Appointment Form", path: paths.home },
    ],
  },
  {
    name: "Pages",
    path: paths.shop,
    children: [
      { name: "Login", path: paths.login },
      { name: "Register", path: paths.register },
      { name: "Services", path: paths.service },
    ],
  },
  {
    name: "Shop",
    path: paths.shop,
  },
  {
    name: "Blog",
    path: paths.shop,
  },
  {
    name: "Contact",
    path: paths.contact,
  },
];

export default navItems;
