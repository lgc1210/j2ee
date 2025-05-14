import React, { useState, useEffect } from 'react';
import UserService from "../../../Services/user";
import CategoryOfServiceService from "../../../Services/categoryOfService";
import AppointmentService from "../../../Services/appointment";
import OrderService from "../../../Services/order";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatisticsPage = () => {
  const [selectedWeek, setSelectedWeek] = useState('');
  const [owners, setOwners] = useState(0);
  const [employees, setEmployees] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [categoryOfServices, setCategoryOfServices] = useState(0);
  const [timeFilter, setTimeFilter] = useState('all');
  const [specificFilter, setSpecificFilter] = useState('');
  const [monthInputValue, setMonthInputValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appointmentStats, setAppointmentStats] = useState({});
  const [orderStats, setOrderStats] = useState({});
  const [serviceCategoryStats, setServiceCategoryStats] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Booked Service Categories' },
    },
  };

  const serviceData = {
    labels: serviceCategoryStats
      ? [...serviceCategoryStats.mostBooked.map(s => s.name), ...serviceCategoryStats.leastBooked.map(s => s.name)]
      : [],
    datasets: [
      {
        label: 'Number of Bookings',
        data: serviceCategoryStats
          ? [...serviceCategoryStats.mostBooked.map(s => s.appointmentCount), ...serviceCategoryStats.leastBooked.map(s => s.appointmentCount)]
          : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const userStatsChartData = {
    labels: ['Owners', 'Staff', 'Customers', 'Service Categories'],
    datasets: [
      {
        label: 'All Time Counts',
        data: [owners, employees, customers, categoryOfServices],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const userStatsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User and Service Statistics (All Time)',
        font: {
          size: 20
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Categories'
        }
      }
    },
  };

  // Fetch user data
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

  // Fetch category of services
  useEffect(() => {
    const fetchCOSs = async () => {
      try {
        const response = await CategoryOfServiceService.getAllCategoryOfServices();
        setCategoryOfServices(response.data?.length || 0);
      } catch (error) {
        console.error("Error fetching service categories:", error);
      }
    };
    fetchCOSs();
  }, []);

  // Fetch appointment statistics
  useEffect(() => {
    const fetchAppointmentStats = async () => {
      try {
        console.log("Fetching appointment stats with:", { timeFilter, specificFilter });
        const response = await AppointmentService.getAppointmentStats(timeFilter, specificFilter);
        setAppointmentStats(response.data);
      } catch (error) {
        console.error("Error fetching appointment stats:", error);
      }
    };
    fetchAppointmentStats();
  }, [timeFilter, specificFilter]);

  // Fetch order statistics
  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        console.log("Fetching order stats with:", { timeFilter, specificFilter });
        const response = await OrderService.getOrderStats(timeFilter, specificFilter);
        setOrderStats(response.data);
      } catch (error) {
        console.error("Error fetching order stats:", error);
      }
    };
    fetchOrderStats();
  }, [timeFilter, specificFilter]);

  // Fetch service category stats
  const fetchData = async (timeFilter, specificFilter) => {
    try {
      const serviceResponse = await AppointmentService.getAppointmentServices(timeFilter, specificFilter);
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
      setStartDate('');
      setEndDate('');
      setSpecificFilter('');
      return;
    }
    const [year, week] = weekString.split('-W');
    const weekNum = parseInt(week, 10);
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeek = firstDayOfYear.getDay();
    const startOfWeek = new Date(firstDayOfYear);
    const daysToAdd = (weekNum - 1) * 7 - (dayOfWeek > 1 ? dayOfWeek - 1 : 0);
    startOfWeek.setDate(firstDayOfYear.getDate() + daysToAdd);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const formatDateForInput = (date) => date.toISOString().split('T')[0];

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
    const weekNum = Math.ceil((diff + startOfYear.getDay() * 24 * 60 * 60 * 1000) / oneWeek);
    return `${year}-W${String(weekNum).padStart(2, '0')}`;
  };


  const handleFilterChange = (filter) => {
    setTimeFilter(filter);
    setStartDate('');
    setEndDate('');
    setSelectedWeek('');
    setSelectedYear('');
    setMonthInputValue('');

    if (filter === 'all') {
      setSpecificFilter('');
    } else if (filter === 'weekly') {
      const currentWeek = getCurrentWeek();
      setSelectedWeek(currentWeek);
      handleWeekChange(currentWeek);
    } else if (filter === 'monthly') {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      setMonthInputValue(`${year}-${month}`);
      setSpecificFilter(`Tháng ${parseInt(month)}/${year}`);
      setSelectedYear(year.toString());
    } else if (filter === 'yearly') {
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
    labels: ['Appointments', 'Ordered Products'],
    datasets: [
      {
        label: `Statistics (${timeFilter === 'all' ? 'All Time' : timeFilter}${specificFilter ? ` - ${specificFilter}` : ''})`,
        data: [currentStats.appointments, currentStats.orderedProducts],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Business Statistics' },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
 
        <h1 className="text-3xl font-bold text-gray-900 text-center">Statistics Dashboard</h1>

      

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter by Time</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            {['all', 'weekly', 'monthly', 'yearly'].map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-4 py-2 rounded-md font-medium capitalize transition-colors ${
                  timeFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {filter === 'all' ? 'All Time' : filter}
              </button>
            ))}
          </div>

          {timeFilter !== 'all' && (
            <div className="space-y-4">
              {timeFilter === 'weekly' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Week</label>
                    <input
                      type="week"
                      value={selectedWeek}
                      onChange={(e) => {
                        setSelectedWeek(e.target.value);
                        handleWeekChange(e.target.value);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              )}
              {timeFilter === 'monthly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
                  <input
                    type="month"
                    value={monthInputValue}
                    onChange={(e) => {
                      const [year, month] = e.target.value.split('-');
                      setMonthInputValue(e.target.value);
                      setSpecificFilter(`Tháng ${parseInt(month)}/${year}`);
                      setSelectedYear(year);
                    }}
                    className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-md"
                    max={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`}
                  />
                </div>
              )}
              {timeFilter === 'yearly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Year</label>
                  <DatePicker
                    selected={selectedYear ? new Date(`${selectedYear}-01-01`) : null}
                    onChange={(date) => {
                      const year = date.getFullYear();
                      setSelectedYear(year.toString());
                      setSpecificFilter(year.toString());
                    }}
                    showYearPicker
                    dateFormat="yyyy"
                    placeholderText="Select Year"
                    className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-md"
                    minDate={new Date(`${new Date().getFullYear() - 15}-01-01`)}
                    maxDate={new Date()}
                  />
                </div>
              )}
            </div>
          )}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-96">
              <Bar data={chartData} options={options} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-96">
              <Pie data={serviceData} options={pieOptions} />
            </div>
          </div>
        </div>



     
          <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-96">
            <Bar 
              data={userStatsChartData} 
              options={userStatsOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;