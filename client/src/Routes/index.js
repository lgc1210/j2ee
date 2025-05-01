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
const Stores = lazy(() => import("../Pages/Stores"));
const Roles = lazy(() => import("../Pages/Roles"));
const Statistic = lazy(() => import("../Pages/Statistic"));
const Booking = lazy(() => import("../Pages/Booking"));
const Statistic1 = lazy(() => import("../Pages/Statistic/Statistic1"));
const Statistic2 = lazy(() => import("../Pages/Statistic/Statistic2"));

const StatisticByAllTime = lazy(() => import("../Pages/Statistic/StatisticByAllTime"));


// Profile Pages
const ProfileChangePassword = lazy(() =>
  import("../Pages/ProfileChangePassword")
);
const ProfileNotifications = lazy(() =>
  import("../Pages/ProfileNotifications")
);
const ProfileBooking = lazy(() => import("../Pages/ProfileBooking"));
const ProfileOrders = lazy(() => import("../Pages/ProfileOrders"));

const routes = [
  {
    isPublic: true,
    url: paths.home,
    Layout: CustomerLayout,
    Page: Home,
  },
  {
    isPublic: true,
    url: paths.login,
    Layout: null,
    Page: Login,
    restrictAuthenticated: true, // prevent logged-in users
  },
  {
    isPublic: true,
    url: paths.register,
    Layout: null,
    Page: Register,
    restrictAuthenticated: true, // prevent logged-in users
  },
  {
    isPublic: true,
    url: paths.shop,
    Layout: CustomerLayout,
    Page: Shop,
  },
  {
    isPublic: true,
    url: paths.notFound,
    Layout: null,
    Page: NotFound,
  },
  // Profile
  {
    isPublic: false,
    url: paths.profilePersonal,
    Layout: ProfileLayout,
    Page: Profile,
  },
  {
    isPublic: false,
    url: paths.profileChangePassword,
    Layout: ProfileLayout,
    Page: ProfileChangePassword,
  },
  {
    isPublic: false,
    url: paths.profileBooking,
    Layout: ProfileLayout,
    Page: ProfileBooking,
  },
  {
    isPublic: false,
    url: paths.profileOrders,
    Layout: ProfileLayout,
    Page: ProfileOrders,
  },
  {
    isPublic: false,
    url: paths.profileNotifications,
    Layout: ProfileLayout,
    Page: ProfileNotifications,
  },
  {
    isPublic: true,
    url: paths.contact,
    Layout: CustomerLayout,
    Page: Contact,
  },
  {
    isPublic: true,
    url: paths.productDetails,
    Layout: CustomerLayout,
    Page: ProductDetails,
  },
  {
    isPublic: true,
    url: paths.cart,
    Layout: CustomerLayout,
    Page: Cart,
  },
  {
    isPublic: true,
    url: paths.service,
    Layout: CustomerLayout,
    Page: Service,
  },
  {
    isPublic: true,
    url: paths.booking,
    Layout: CustomerLayout,
    Page: Booking,
  },
  {
    isPublic: false,
    url: paths.dashboard,
    Layout: AdminLayout,
    Page: Dashboard,
    requiredRole: ["admin"],
  },
  {
    isPublic: false,
    url: paths.users,
    Layout: AdminLayout,
    Page: Users,
    requiredRole: ["admin"],
  },
  {
    isPublic: false,
    url: paths.products,
    Layout: AdminLayout,
    Page: Products,
    requiredRole: ["admin"],
  },
  {
    isPublic: false,
    url: paths.categories,
    Layout: AdminLayout,
    Page: Categories,
    requiredRole: ["admin"],
  },
  {
    isPublic: false,
    url: paths.discounts,
    Layout: AdminLayout,
    Page: Discounts,
    requiredRole: ["admin"],
  },
  {
    isPublic: false,
    url: paths.stores,
    Layout: AdminLayout,
    Page: Stores,
    requiredRole: ["admin"],
  },
  {
    isPublic: false,
    url: paths.roles,
    Layout: AdminLayout,
    Page: Roles,
    requiredRole: ["admin"],
  },
  {
    isPublic: false,
    url: paths.statistic,
    Layout: AdminLayout,
    Page: Statistic,
    requiredRole: ["admin"],
  },
  {
    isPublic: false,
    url: paths.statistic1,
    Layout: AdminLayout,
    Page: Statistic1,
    requiredRole: ["admin"],
  },
  {
    isPublic: false,
    url: paths.statistic2,
    Layout: AdminLayout,
    Page: Statistic2,
    requiredRole: ["admin"],
  },
  {
    isPublic: false,
    url: paths.statisticByAllTime,
    Layout: AdminLayout,
    Page: StatisticByAllTime,
    requiredRole: ["admin"],
  },
];
export default routes;