import paths from "../../Constants/paths";

const items = [
  {
    path: paths.ownerhome,
    name: "Home",
    requiredAuth: true,
    requiredRole: ["owner"],
  },
  {
    path: paths.ownerstore,
    name: "Store",
    requiredAuth: true,
    requiredRole: ["owner"],
  },
  {
    path: paths.ownerproducts,
    name: "Products",
    requiredAuth: true,
    requiredRole: ["owner"],
  },
  {
    path: paths.ownercategories,
    name: "Categories",
    requiredAuth: true,
    requiredRole: ["owner"],
  },
  {
    path: paths.owneremployees,
    name: "Employees",
    requiredAuth: true,
    requiredRole: ["owner"],
  },
  {
    path: paths.ownerappointments,
    name: "Appointments",
    requiredAuth: true,
    requiredRole: ["owner"],
  },
  {
    path: paths.ownerorders,
    name: "Order",
    requiredAuth: true,
    requiredRole: ["owner"],
  },
  {
    path: paths.ownerservices,
    name: "Services",
    requiredAuth: true,
    requiredRole: ["owner"],
  },
  {
    path: paths.ownerreviews,
    name: "Reviews",
    requiredAuth: true,
    requiredRole: ["owner"],
  },
  {
    path: paths.ownerstatistic,
    name: "Statistic",
    requiredAuth: true,
    requiredRole: ["owner"],
    children: [
      {
        path: paths.statisticUser,
        name: "Owner/Customer/Staff",
        requiredAuth: true,
      },
    ],
  },
];

export default items;
