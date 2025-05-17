import paths from "../../Constants/paths";

const items = [
	{
		path: paths.dashboard,
		name: "Dashboard",
		requiredAuth: true,
		requiredRole: ["admin"],
	},
	{
		path: paths.users,
		name: "Users",
		requiredAuth: true,
		requiredRole: ["admin"],
	},
	{
		path: paths.categories,
		name: "Categories",
		requiredAuth: true,
		requiredRole: ["admin"],
	},
	{
		path: paths.contacts,
		name: "Contacts",
		requiredAuth: true,
		requiredRole: ["admin"],
	},
	{
		path: paths.roles,
		name: "Roles",
		requiredAuth: true,
		requiredRole: ["admin"],
	},
	{
		path: paths.statisticByAllTime,
		name: "Statistic",
		requiredAuth: true,
		requiredRole: ["admin"],
	},
];

export default items;
