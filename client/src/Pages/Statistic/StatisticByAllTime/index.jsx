import { useState, useEffect } from "react";
import UserService from "../../../Services/user";
import CategoryOfServiceService from "../../../Services/categoryOfService";
import AppointmentService from "../../../Services/appointment";
import OrderService from "../../../Services/order";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	ArcElement,
	Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const theme = {
	primary: "#435d63",
	primaryLight: "#5a7a82",
	primaryDark: "#334549",
	secondary: "#63a5b5",
	secondaryLight: "#84c2d0",
	accent: "#d2a979",
	accentLight: "#e0c3b9",
	neutral: "#f0f4f5",
	neutral2: "#dae5e7",
	text: "#2c3e42",
};

const StatisticsPage = () => {
	const [selectedWeek, setSelectedWeek] = useState("");
	const [owners, setOwners] = useState(0);
	const [employees, setEmployees] = useState(0);
	const [customers, setCustomers] = useState(0);
	const [categoryOfServices, setCategoryOfServices] = useState(0);
	const [timeFilter, setTimeFilter] = useState("all");
	const [specificFilter, setSpecificFilter] = useState("");
	const [monthInputValue, setMonthInputValue] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [appointmentStats, setAppointmentStats] = useState({});
	const [orderStats, setOrderStats] = useState({});
	const [serviceCategoryStats, setServiceCategoryStats] = useState(null);
	const [selectedYear, setSelectedYear] = useState("");

	const pieOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "right",
				labels: { font: { size: 12 }, padding: 20, color: theme.text },
			},
			title: {
				display: true,
				text: "Service Categories Booking Distribution",
				color: theme.text,
				font: { size: 16, weight: "bold" },
				padding: { top: 10, bottom: 20 },
			},
		},
	};

	const serviceData = {
		labels: serviceCategoryStats
			? [
					...serviceCategoryStats.mostBooked.map((s) => s.name),
					...serviceCategoryStats.leastBooked.map((s) => s.name),
			  ]
			: [],
		datasets: [
			{
				label: "Number of Bookings",
				data: serviceCategoryStats
					? [
							...serviceCategoryStats.mostBooked.map((s) => s.appointmentCount),
							...serviceCategoryStats.leastBooked.map(
								(s) => s.appointmentCount
							),
					  ]
					: [],
				backgroundColor: [
					`rgba(67, 93, 99, 0.8)`,
					`rgba(90, 122, 130, 0.8)`,
					`rgba(51, 69, 73, 0.8)`,
					`rgba(99, 165, 181, 0.8)`,
					`rgba(132, 194, 208, 0.8)`,
					`rgba(210, 169, 121, 0.8)`,
					`rgba(224, 195, 153, 0.8)`,
					`rgba(99, 165, 181, 0.6)`,
				],
				borderColor: [
					`rgba(67, 93, 99, 1)`,
					`rgba(90, 122, 130, 1)`,
					`rgba(51, 69, 73, 1)`,
					`rgba(99, 165, 181, 1)`,
					`rgba(132, 194, 208, 1)`,
					`rgba(210, 169, 121, 1)`,
					`rgba(224, 195, 153, 1)`,
					`rgba(99, 165, 181, 1)`,
				],
				borderWidth: 2,
				hoverOffset: 15,
			},
		],
	};

	const userStatsChartData = {
		labels: ["Owners", "Staff", "Customers", "Service Categories"],
		datasets: [
			{
				label: "All Time Counts",
				data: [owners, employees, customers, categoryOfServices],
				backgroundColor: [
					`rgba(67, 93, 99, 0.7)`,
					`rgba(90, 122, 130, 0.7)`,
					`rgba(99, 165, 181, 0.7)`,
					`rgba(210, 169, 121, 0.7)`,
				],
				borderColor: [
					`rgba(67, 93, 99, 1)`,
					`rgba(90, 122, 130, 1)`,
					`rgba(99, 165, 181, 1)`,
					`rgba(210, 169, 121, 1)`,
				],
				borderWidth: 2,
				borderRadius: 5,
			},
		],
	};

	const userStatsOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
				labels: { font: { size: 12 }, color: theme.text },
			},
			title: {
				display: true,
				text: "User and Service Statistics (All Time)",
				color: theme.text,
				font: { size: 16, weight: "bold" },
				padding: { top: 10, bottom: 20 },
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: "Count",
					color: theme.text,
					font: { weight: "bold" },
				},
				grid: { color: "rgba(67, 93, 99, 0.1)" },
				ticks: { color: theme.text },
			},
			x: {
				title: {
					display: true,
					text: "Categories",
					color: theme.text,
					font: { weight: "bold" },
				},
				grid: { display: false },
				ticks: { color: theme.text },
			},
		},
	};

	useEffect(() => {
		const fetchDatas = async (id, setData) => {
			try {
				const response = await UserService.getUsersByRoleId(id);
				setData(response.data.length);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		fetchDatas(1, setEmployees);
		fetchDatas(2, setCustomers);
		fetchDatas(3, setOwners);
	}, []);

	useEffect(() => {
		const fetchCOSs = async () => {
			try {
				const response =
					await CategoryOfServiceService.getAllCategoryOfServices();
				setCategoryOfServices(response.data?.length || 0);
			} catch (error) {
				console.error("Error fetching service categories:", error);
			}
		};
		fetchCOSs();
	}, []);

	useEffect(() => {
		const fetchAppointmentStats = async () => {
			try {
				const response = await AppointmentService.getAppointmentStats(
					timeFilter,
					specificFilter
				);
				setAppointmentStats(response.data);
			} catch (error) {
				console.error("Error fetching appointment stats:", error);
			}
		};
		fetchAppointmentStats();
	}, [timeFilter, specificFilter]);

	useEffect(() => {
		const fetchOrderStats = async () => {
			try {
				const response = await OrderService.getOrderStats(
					timeFilter,
					specificFilter
				);
				setOrderStats(response.data);
			} catch (error) {
				console.error("Error fetching order stats:", error);
			}
		};
		fetchOrderStats();
	}, [timeFilter, specificFilter]);

	const fetchData = async (timeFilter, specificFilter) => {
		try {
			const serviceResponse = await AppointmentService.getAppointmentServices(
				timeFilter,
				specificFilter
			);
			setServiceCategoryStats(serviceResponse.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchData(timeFilter, specificFilter);
	}, [timeFilter, specificFilter]);

	const handleWeekChange = (weekString) => {
		if (!weekString) {
			setStartDate("");
			setEndDate("");
			setSpecificFilter("");
			return;
		}
		const [year, week] = weekString.split("-W");
		const weekNum = parseInt(week, 10);
		const firstDayOfYear = new Date(year, 0, 1);
		const dayOfWeek = firstDayOfYear.getDay();
		const startOfWeek = new Date(firstDayOfYear);
		const daysToAdd = (weekNum - 1) * 7 - (dayOfWeek > 1 ? dayOfWeek - 1 : 0);
		startOfWeek.setDate(firstDayOfYear.getDate() + daysToAdd);
		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(startOfWeek.getDate() + 6);
		const formatDateForInput = (date) => date.toISOString().split("T")[0];

		setStartDate(formatDateForInput(startOfWeek));
		setEndDate(formatDateForInput(endOfWeek));
		setSpecificFilter(weekString);
	};

	const getCurrentWeek = () => {
		const now = new Date();
		const year = now.getFullYear();
		const startOfYear = new Date(year, 0, 1);
		const diff = now - startOfYear;
		const oneWeek = 1000 * 60 * 60 * 24 * 7;
		const weekNum = Math.ceil(
			(diff + startOfYear.getDay() * 24 * 60 * 60 * 1000) / oneWeek
		);
		return `${year}-W${String(weekNum).padStart(2, "0")}`;
	};

	const handleFilterChange = (filter) => {
		setTimeFilter(filter);
		setStartDate("");
		setEndDate("");
		setSelectedWeek("");
		setSelectedYear("");
		setMonthInputValue("");

		if (filter === "all") {
			setSpecificFilter("");
		} else if (filter === "weekly") {
			const currentWeek = getCurrentWeek();
			setSelectedWeek(currentWeek);
			handleWeekChange(currentWeek);
		} else if (filter === "monthly") {
			const now = new Date();
			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, "0");
			setMonthInputValue(`${year}-${month}`);
			setSpecificFilter(`Tháng ${parseInt(month)}/${year}`);
			setSelectedYear(year.toString());
		} else if (filter === "yearly") {
			const currentYear = new Date().getFullYear();
			setSelectedYear(currentYear.toString());
			setSpecificFilter(currentYear.toString());
		}
	};

	const statsData = {
		all: {
			owners,
			staff: employees,
			customers,
			serviceCategories: categoryOfServices,
			appointments: appointmentStats.allTime || 0,
			orderedProducts: orderStats.allTime || 0,
		},
		weekly: {
			appointments: appointmentStats.weekly || 0,
			orderedProducts: orderStats.weekly || 0,
		},
		monthly: {
			appointments: appointmentStats.monthly || 0,
			orderedProducts: orderStats.monthly || 0,
		},
		yearly: {
			appointments: appointmentStats.yearly || 0,
			orderedProducts: orderStats.yearly || 0,
		},
	};

	const currentStats = statsData[timeFilter];

	const chartData = {
		labels: ["Appointments", "Ordered Products"],
		datasets: [
			{
				label: `${
					timeFilter === "all"
						? "All Time"
						: timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)
				} Statistics`,
				data: [currentStats.appointments, currentStats.orderedProducts],
				backgroundColor: [`rgba(67, 93, 99, 0.7)`, `rgba(99, 165, 181, 0.7)`],
				borderColor: [`rgba(67, 93, 99, 1)`, `rgba(99, 165, 181, 1)`],
				borderWidth: 2,
				borderRadius: 5,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
				labels: { font: { size: 12 }, color: theme.text },
			},
			title: {
				display: true,
				text: `Business Statistics ${
					specificFilter ? ` - ${specificFilter}` : ""
				}`,
				color: theme.text,
				font: { size: 16, weight: "bold" },
				padding: { top: 10, bottom: 20 },
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: { color: "rgba(67, 93, 99, 0.1)" },
				ticks: { font: { size: 12 }, color: theme.text },
			},
			x: {
				grid: { display: false },
				ticks: { font: { size: 12 }, color: theme.text },
			},
		},
	};

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
			<style>
				{`
          .custom-datepicker {
            border: 1px solid ${theme.neutral2};
            border-radius: 0.5rem;
            padding: 0.5rem;
            width: 100%;
            font-size: 0.875rem;
            color: ${theme.text};
          }
          .custom-datepicker:focus {
            outline: none;
            border-color: ${theme.primary};
            box-shadow: 0 0 0 3px rgba(67, 93, 99, 0.2);
          }
          .filter-button {
            transition: all 0.3s ease;
          }
          .filter-button:hover {
            transform: translateY(-2px);
            background-color: ${theme.primaryLight};
            color: white;
          }
          .filter-button.active {
            background: ${theme.primary};
            color: white;
            transform: scale(1.05);
          }
          .card {
            transition: all 0.3s ease;
          }
          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          }
        `}
			</style>
			<div className='max-w-7xl mx-auto space-y-6'>
				{/* Header Section */}
				<div className='bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#435d63] card'>
					<div className='flex flex-col md:flex-row justify-between items-center'>
						<div>
							<h1 className='text-2xl font-semibold text-[#2c3e42]'>
								Statistics Dashboard
							</h1>
							<p className='text-gray-500 text-sm mt-1'>
								Monitor business performance
							</p>
						</div>
						<div className='flex items-center space-x-3 mt-4 md:mt-0'>
							<span className='bg-[#f0f4f5] px-3 py-1 rounded-full text-sm font-medium text-[#2c3e42]'>
								{timeFilter === "all"
									? "All Time"
									: timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}
							</span>
						</div>
					</div>
				</div>

				{/* Summary Cards */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
					{[
						{
							title: "Owners",
							value: owners,
							icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
							color: "bg-[#435d63]",
						},
						{
							title: "Staff",
							value: employees,
							icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
							color: "bg-[#5a7a82]",
						},
						{
							title: "Customers",
							value: customers,
							icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
							color: "bg-[#63a5b5]",
						},
						{
							title: "Service Categories",
							value: categoryOfServices,
							icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
							color: "bg-[#d2a979]",
						},
					].map((stat, index) => (
						<div
							key={index}
							className='bg-white rounded-lg shadow-sm p-4 flex items-center justify-between card'>
							<div>
								<p className='text-gray-500 text-sm font-medium'>
									{stat.title}
								</p>
								<p className='text-xl font-semibold text-[#2c3e42]'>
									{stat.value}
								</p>
							</div>
							<div
								className={`h-10 w-10 rounded-full ${stat.color} flex items-center justify-center`}>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-6 w-6 text-white'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d={stat.icon}
									/>
								</svg>
							</div>
						</div>
					))}
				</div>

				{/* Time Filter Section */}
				<div className='bg-white rounded-lg shadow-sm p-6 card'>
					<h2 className='text-lg font-semibold text-[#2c3e42] mb-4'>
						Time Period Filter
					</h2>
					<div className='flex flex-wrap gap-3 mb-6'>
						{["all", "weekly", "monthly", "yearly"].map((filter) => (
							<button
								key={filter}
								onClick={() => handleFilterChange(filter)}
								className={`filter-button px-4 py-2 rounded-lg text-sm font-medium ${
									timeFilter === filter
										? "active"
										: "bg-[#f0f4f5] text-[#2c3e42] hover:bg-[#dae5e7]"
								}`}>
								{filter === "all"
									? "All Time"
									: filter.charAt(0).toUpperCase() + filter.slice(1)}
							</button>
						))}
					</div>
					{timeFilter !== "all" && (
						<div className='p-4 bg-[#f0f4f5] rounded-lg'>
							{timeFilter === "weekly" && (
								<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
									<div>
										<label className='block text-sm font-medium text-[#2c3e42] mb-1'>
											Select Week
										</label>
										<input
											type='week'
											value={selectedWeek}
											onChange={(e) => {
												setSelectedWeek(e.target.value);
												handleWeekChange(e.target.value);
											}}
											className='custom-datepicker'
										/>
									</div>
									<div className='sm:col-span-2 grid grid-cols-2 gap-4'>
										<div>
											<label className='block text-sm font-medium text-[#2c3e42] mb-1'>
												Start Date
											</label>
											<input
												type='date'
												value={startDate}
												readOnly
												className='custom-datepicker bg-gray-100'
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-[#2c3e42] mb-1'>
												End Date
											</label>
											<input
												type='date'
												value={endDate}
												readOnly
												className='custom-datepicker bg-gray-100'
											/>
										</div>
									</div>
								</div>
							)}
							{timeFilter === "monthly" && (
								<div>
									<label className='block text-sm font-medium text-[#2c3e42] mb-1'>
										Select Month
									</label>
									<input
										type='month'
										value={monthInputValue}
										onChange={(e) => {
											const [year, month] = e.target.value.split("-");
											setMonthInputValue(e.target.value);
											setSpecificFilter(`Tháng ${parseInt(month)}/${year}`);
											setSelectedYear(year);
										}}
										className='custom-datepicker w-full sm:w-1/2'
										max={`${new Date().getFullYear()}-${String(
											new Date().getMonth() + 1
										).padStart(2, "0")}`}
									/>
								</div>
							)}
							{timeFilter === "yearly" && (
								<div>
									<label className='block text-sm font-medium text-[#2c3e42] mb-1'>
										Select Year
									</label>
									<div className='w-full sm:w-1/2'>
										<DatePicker
											selected={
												selectedYear ? new Date(`${selectedYear}-01-01`) : null
											}
											onChange={(date) => {
												const year = date.getFullYear();
												setSelectedYear(year.toString());
												setSpecificFilter(year.toString());
											}}
											showYearPicker
											dateFormat='yyyy'
											placeholderText='Select Year'
											className='custom-datepicker'
											minDate={
												new Date(`${new Date().getFullYear() - 15}-01-01`)
											}
											maxDate={new Date()}
										/>
									</div>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Charts Section */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					<div className='bg-white rounded-lg shadow-sm card overflow-hidden'>
						<div className='bg-[#435d63] text-white px-6 py-3'>
							<h2 className='text-lg font-semibold'>Business Activity</h2>
						</div>
						<div className='p-4'>
							<div className='h-80'>
								<Bar data={chartData} options={options} />
							</div>
						</div>
					</div>
					<div className='bg-white rounded-lg shadow-sm card overflow-hidden'>
						<div className='bg-[#435d63] text-white px-6 py-3'>
							<h2 className='text-lg font-semibold'>
								Service Categories Distribution
							</h2>
						</div>
						<div className='p-4'>
							<div className='h-80'>
								<Pie data={serviceData} options={pieOptions} />
							</div>
						</div>
					</div>
				</div>

				{/* User Stats Chart */}
				<div className='bg-white rounded-lg shadow-sm card overflow-hidden'>
					<div className='bg-[#435d63] text-white px-6 py-3'>
						<h2 className='text-lg font-semibold'>User & Service Overview</h2>
					</div>
					<div className='p-4'>
						<div className='h-80'>
							<Bar data={userStatsChartData} options={userStatsOptions} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StatisticsPage;
