const paths = {
	// Owner Paths
	ownerhome: "/owner/home",
	ownerstore: "/owner/store",
	owneremployees: "/owner/employees",
	ownerservices: "/owner/services",
	ownerproducts: "/owner/products",
	ownercategories: "/owner/categories",
	ownerappointments: "/owner/appointments",
	ownerorder: "/owner/orders",
	ownerreviews: "/owner/reviews",
	ownerstatistic: "/owner/statistic",
	// Customer Paths
	home: "/",
	shop: "/shop",
	login: "/login",
	googleLoginCallback: "/auth/google/callback",
	register: "/register",
	checkout: "/checkout",
	contact: "/contact",
	profilePersonal: "/profile/personal",
	profileChangePassword: "/profile/changepassword",
	profileNotifications: "/profile/notifications",
	profileBooking: "/profile/booking",
	profileOrders: "/profile/orders",
	service: "/service",
	cart: "/cart",
	blog: "/blog",
	booking: "/booking",
	about: "/about",
	appointment: "/appointment",
	bookingCalendar: "/booking/calendar",
	productDetails: "/shop/products/details/:id",
	// Not Found Path
	notFound: "*",
	// Admin Paths
	dashboard: "/admin/dashboard",
	users: "/admin/users",
	products: "/admin/products",
	categories: "/admin/categories",
	discounts: "/admin/discounts",
	contacts: "/admin/contacts",
	roles: "/admin/roles",
	// Admin statistic
	statistic: "/admin/statistic",
	statisticByAllTime: "/admin/statistic/byalltime",
	statisticWeekly: "/admin/statistic/weekly",
	statisticMonthly: "/admin/statistic/monthly",
	statisticYearly: "/admin/statistic/yearly",
	statisticUser: "/admin/statistic/user",
	statisticServiceCategories: "/admin/statistic/servicecategories",
	statisticAppointment: "/admin/statistic/appointment",
	statisticOrderedProducts: "/admin/statistic/orderedproducts",
	statisticStoreRegisterOvertime: "/admin/statistic/storeregisterovertime",
	statisticStoreHighestLowestAppointments:
		"/admin/statistic/storehighestlowestappointments",
	statisticStoreHighestLowestRevenues:
		"/admin/statistic/storehighestlowestrevenues",
	statisticCustomerHighestLowestAppointments:
		"/admin/statistic/customerhighestlowestappointments",
	statisticStaffHighestLowestAppointments:
		"/admin/statistic/staffhighestlowestappointments",
	statisticMostLeastBookedServiceCategories:
		"/admin/statistic/mostlestbookedservicecategories",
	statisticBusiestDaysOfWeek: "/admin/statistic/busiestdaysofweek",
	statisticPopularTimeSlotsForAppointments: "/admin/statistic/populartimeslots",
};

export default paths;
