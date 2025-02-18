import paths from "../Constants/paths";
import { lazy } from "react";

// Layouts
const CustomerLayout = lazy(() => import("../Layouts/Customer"));
const AdminLayout = lazy(() => import("../Layouts/Admin"));
const ProfileLayout = lazy(() => import("../Layouts/Profile"));

// Customer Pages
const Home = lazy(() => import("../Pages/Home"));
const Login = lazy(() => import("../Pages/Login"));
const Register = lazy(() => import("../Pages/Register"));
const Shop = lazy(() => import("../Pages/Shop"));
const NotFound = lazy(() => import("../Pages/NotFound"));
const Profile = lazy(() => import("../Pages/Profile"));
const Contact = lazy(() => import("../Pages/Contact"));
const ProductDetails = lazy(() => import("../Pages/ProductDetails"));
const Cart = lazy(() => import("../Pages/Cart"));

// Admin Pages
const Admin = lazy(() => import("../Pages/Admin"));

const routes = {
  home: {
    isPublic: true,
    url: paths.home,
    Layout: CustomerLayout,
    Page: Home,
  },
  login: {
    isPublic: true,
    url: paths.login,
    Layout: null,
    Page: Login,
  },
  register: {
    isPublic: true,
    url: paths.register,
    Layout: null,
    Page: Register,
  },
  shop: {
    isPublic: true,
    url: paths.shop,
    Layout: CustomerLayout,
    Page: Shop,
  },
  notFound: {
    isPublic: true,
    url: paths.notFound,
    Layout: null,
    Page: NotFound,
  },
  profile: {
    isPublic: false,
    url: paths.profile,
    Layout: ProfileLayout,
    Page: Profile,
  },
  contact: {
    isPublic: true,
    url: paths.contact,
    Layout: CustomerLayout,
    Page: Contact,
  },
  productDetails: {
    isPublic: true,
    url: paths.productDetails,
    Layout: CustomerLayout,
    Page: ProductDetails,
  },
  cart: {
    isPublic: true,
    url: paths.cart,
    Layout: CustomerLayout,
    Page: Cart,
  },
  admin: {
    isPublic: false,
    url: paths.admin,
    Layout: AdminLayout,
    Page: Admin,
  },
};
export default routes;
