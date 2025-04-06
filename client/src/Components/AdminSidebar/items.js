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
		path: paths.products,
		name: "Products",
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
		path: paths.discounts,
		name: "Discounts",
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
		path: paths.statistic,
		name: "Statistic",
		requiredAuth: true,
		requiredRole: ["admin"],
		children: [
			{
				path: paths.statisticUser,
				name: "Owner/Customer/Staff",
				requiredAuth: true,
			},
			{
				path: paths.statisticByAllTime,
				name: "By all time",
				requiredAuth: true,
			},
			{
				path: paths.statisticWeekly,
				name: "Weekly",
				requiredAuth: true,
			},
			{
				path: paths.statisticMonthly,
				name: "Monthly",
				requiredAuth: true,
			},
			{
				path: paths.statisticYearly,
				name: "Yearly",
				requiredAuth: true,
			},
			{
				path: paths.statisticServiceCategories,
				name: "Service categories",
				requiredAuth: true,
			},
			{
				path: paths.statisticAppointment,
				name: "Appointments",
				requiredAuth: true,
			},
			{
				path: paths.statisticOrderedProducts,
				name: "Ordered products",
				requiredAuth: true,
			},
			{
				path: paths.statisticStoreRegisterOvertime,
				name: "Stores overtime",
				requiredAuth: true,
			},
			{
				path: paths.statisticStoreHighestLowestAppointments,
				name: "Highest/Lowest appointments stores",
				requiredAuth: true,
			},
			{
				path: paths.statisticStoreHighestLowestRevenues,
				name: "Highest/Lowest appointments revenues",
				requiredAuth: true,
			},
			{
				path: paths.statisticCustomerHighestLowestAppointments,
				name: "Highest/Lowest appointments customers",
				requiredAuth: true,
			},
			{
				path: paths.statisticStaffHighestLowestAppointments,
				name: "Highest/Lowest appointments staff",
				requiredAuth: true,
			},
			{
				path: paths.statisticMostLeastBookedServiceCategories,
				name: "Most/Least service categories booked",
				requiredAuth: true,
			},
			{
				path: paths.statisticBusiestDaysOfWeek,
				name: "Busiest days of week",
				requiredAuth: true,
			},
			{
				path: paths.statisticPopularTimeSlotsForAppointments,
				name: "Popular time slots for appointments",
				requiredAuth: true,
			},
		],
	},
];

export default items;
