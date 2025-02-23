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
const Service = lazy(() => import("../Pages/Service"));

// Admin Pages
const Dashboard = lazy(() => import("../Pages/Dashboard"));
const Users = lazy(() => import("../Pages/Users"));
const Products = lazy(() => import("../Pages/Products"));
const Categories = lazy(() => import("../Pages/Categories"));
const Discounts = lazy(() => import("../Pages/Discounts"));
const Contacts = lazy(() => import("../Pages/Contacts"));
const Roles = lazy(() => import("../Pages/Roles"));
const Statistic = lazy(() => import("../Pages/Statistic"));

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
  service: {
    isPublic: true,
    url: paths.service,
    Layout: CustomerLayout,
    Page: Service,
  },
  adminDashboard: {
    isPublic: true,
    url: paths.dashboard,
    Layout: AdminLayout,
    Page: Dashboard,
  },
  adminUsers: {
    isPublic: true,
    url: paths.users,
    Layout: AdminLayout,
    Page: Users,
  },
  adminProducts: {
    isPublic: true,
    url: paths.products,
    Layout: AdminLayout,
    Page: Products,
  },
  adminCategories: {
    isPublic: true,
    url: paths.categories,
    Layout: AdminLayout,
    Page: Categories,
  },
  adminDiscounts: {
    isPublic: true,
    url: paths.discounts,
    Layout: AdminLayout,
    Page: Discounts,
  },
  adminContacts: {
    isPublic: true,
    url: paths.contacts,
    Layout: AdminLayout,
    Page: Contacts,
  },
  adminRoles: {
    isPublic: true,
    url: paths.roles,
    Layout: AdminLayout,
    Page: Roles,
  },
  adminStatistic: {
    isPublic: true,
    url: paths.statistic,
    Layout: AdminLayout,
    Page: Statistic,
  },
};
export default routes;
