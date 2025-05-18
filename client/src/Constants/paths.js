const paths = {
	// Owner Paths
	ownerhome: "/owner/home",
	ownerstore: "/owner/store",
	owneremployees: "/owner/employees",
	ownerservices: "/owner/services",
	ownerproducts: "/owner/products",
	ownercategories: "/owner/categories",
	ownerappointments: "/owner/appointments",
	ownerorders: "/owner/orders",
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
	userDetails: "/admin/users/:id",
	stores: "/admin/stores",
	storeDetails: "/admin/stores/:id",
	products: "/admin/products",
	categories: "/admin/categories",
	discounts: "/admin/discounts",
	contacts: "/admin/contacts",
	roles: "/admin/roles",

	// Admin statistic
	statisticByAllTime: "/admin/statistic/byalltime",
};

export default paths;
