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
    path: paths.booking,
    children: [
      { name: "Appointment Booking Calendar", path: paths.booking },
      { name: "Appointment Form", path: paths.home },
    ],
  },
  {
    name: "Pages",
    path: paths.shop,
    children: [
      // Show login/register only for non-authenticated users
      {
        name: "Login",
        path: paths.login,
        requiresAuth: false,
        hideWhenAuth: true,
      },
      {
        name: "Register",
        path: paths.register,
        requiresAuth: false,
        hideWhenAuth: true,
      },
      // Show logout only for authenticated users
      { name: "Logout", path: paths.logout, requiresAuth: true, auth: true },
      { name: "Services", path: paths.service },
      { name: "Account", path: paths.profilePersonal, requiresAuth: true },
    ],
  },
  {
    name: "Shop",
    path: paths.shop,
  },
  {
    name: "Blog",
    path: paths.blog,
  },
  {
    name: "Contact",
    path: paths.contact,
  },
];

export default navItems;
