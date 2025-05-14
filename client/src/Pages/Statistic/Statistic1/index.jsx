import React, { useState, useEffect } from 'react';
import Statistics from '../../../Services/statistic';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatisticsPage = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [specificFilter, setSpecificFilter] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [monthInputValue, setMonthInputValue] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [storeAppointmentStats, setStoreAppointmentStats] = useState({ mostBooked: [], leastBooked: [] });
  const [storeRevenueStats, setStoreRevenueStats] = useState({ highestRevenue: [], lowestRevenue: [] });
  const [customerStats, setCustomerStats] = useState({ mostBooked: [], leastBooked: [] });
  const [staffStats, setStaffStats] = useState({ mostBooked: [], leastBooked: [] });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Statistics' },
    },
    scales: { y: { beginAtZero: true } },
  };

  const filterExtremes = (array, valueKey, nameKey, idKey) => {
    if (!array || array.length === 0) return { highest: [], lowest: [] };

    const cleanedArray = array
      .filter(item => item && item[idKey] !== undefined && item[idKey] !== null)
      .map(item => ({
        ...item,
        [nameKey]: item[nameKey] || `None_${item[idKey]}`,
      }));

    const uniqueArray = Array.from(
      new Map(cleanedArray.map(item => [item[idKey], item])).values()
    );

    if (uniqueArray.length === 0) return { highest: [], lowest: [] };

    const values = uniqueArray.map(item => item[valueKey]);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    const highest = uniqueArray.filter(item => item[valueKey] === maxValue).slice(0, 1);
    const lowest = uniqueArray.filter(item => item[valueKey] === minValue).slice(0, 1);

    return {
      highest,
      lowest,
    };
  };

  const getStoreAppointmentChartData = () => {
    const labels = [
      ...storeAppointmentStats.mostBooked.map(s => s.storeName),
      ...storeAppointmentStats.leastBooked.map(s => s.storeName),
    ];
    const data = [
      ...storeAppointmentStats.mostBooked.map(s => s.value),
      ...storeAppointmentStats.leastBooked.map(s => s.value),
    ];

    return {
      labels: labels.length > 0 ? labels : ['No data'],
      datasets: [{
        label: 'Appointment Count',
        data: data.length > 0 ? data : [0],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      }],
    };
  };

  const getStoreRevenueChartData = () => {
    const labels = [
      ...storeRevenueStats.highestRevenue.map(s => s.storeName),
      ...storeRevenueStats.lowestRevenue.map(s => s.storeName),
    ];
    const data = [
      ...storeRevenueStats.highestRevenue.map(s => s.value),
      ...storeRevenueStats.lowestRevenue.map(s => s.value),
    ];

    return {
      labels: labels.length > 0 ? labels : ['No data'],
      datasets: [{
        label: 'Revenue',
        data: data.length > 0 ? data : [0],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }],
    };
  };

  const getCustomerChartData = () => {
    const labels = [
      ...customerStats.mostBooked.map(c => c.userName),
      ...customerStats.leastBooked.map(c => c.userName),
    ];
    const data = [
      ...customerStats.mostBooked.map(c => c.appointmentCount),
      ...customerStats.leastBooked.map(c => c.appointmentCount),
    ];

    return {
      labels: labels.length > 0 ? labels : ['No data'],
      datasets: [{
        label: 'Appointment Count',
        data: data.length > 0 ? data : [0],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }],
    };
  };

  const getStaffChartData = () => {
    const labels = [
      ...staffStats.mostBooked.map(s => s.userName),
      ...staffStats.leastBooked.map(s => s.userName),
    ];
    const data = [
      ...staffStats.mostBooked.map(s => s.appointmentCount),
      ...staffStats.leastBooked.map(s => s.appointmentCount),
    ];

    return {
      labels: labels.length > 0 ? labels : ['No data'],
      datasets: [{
        label: 'Appointment Count',
        data: data.length > 0 ? data : [0],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      }],
    };
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [storeAppt, storeRev, cust, staff] = await Promise.all([
          Statistics.getStoreAppointmentStats(timeFilter, specificFilter),
          Statistics.getStoreRevenueStats(timeFilter, specificFilter),
          Statistics.getCustomerAppointmentStats(timeFilter, specificFilter),
          Statistics.getStaffAppointmentStats(timeFilter, specificFilter),
        ]);

        const filteredStoreAppt = {
          mostBooked: filterExtremes(storeAppt.data.mostBooked, 'value', 'storeName', 'storeId').highest,
          leastBooked: filterExtremes(storeAppt.data.leastBooked, 'value', 'storeName', 'storeId').lowest,
        };

        const filteredStoreRev = {
          highestRevenue: filterExtremes(storeRev.data.highestRevenue, 'value', 'storeName', 'storeId').highest,
          lowestRevenue: filterExtremes(storeRev.data.lowestRevenue, 'value', 'storeName', 'storeId').lowest,
        };

        const filteredCust = {
          mostBooked: filterExtremes(cust.data.mostBooked, 'appointmentCount', 'userName', 'userId').highest,
          leastBooked: filterExtremes(cust.data.leastBooked, 'appointmentCount', 'userName', 'userId').lowest,
        };

        const filteredStaff = {
          mostBooked: filterExtremes(staff.data.mostBooked, 'appointmentCount', 'userName', 'userId').highest,
          leastBooked: filterExtremes(staff.data.leastBooked, 'appointmentCount', 'userName', 'userId').lowest,
        };

        setStoreAppointmentStats(filteredStoreAppt);
        setStoreRevenueStats(filteredStoreRev);
        setCustomerStats(filteredCust);
        setStaffStats(filteredStaff);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };
    fetchStats();
  }, [timeFilter, specificFilter]);

  const handleWeekChange = (weekString) => {
    if (!weekString) {
      setSpecificFilter('');
      setSelectedWeek('');
      return;
    }
    setSelectedWeek(weekString);
    setSpecificFilter(weekString);
  };

  const handleFilterChange = (filter) => {
    setTimeFilter(filter);
    setSpecificFilter('');
    setSelectedWeek('');
    setMonthInputValue('');
    setSelectedYear('');

    if (filter === 'weekly') {
      const currentWeek = getCurrentWeek();
      setSelectedWeek(currentWeek);
      setSpecificFilter(currentWeek);
    } else if (filter === 'monthly') {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      setMonthInputValue(`${year}-${month}`);
      setSpecificFilter(`${year}-${month}`);
    } else if (filter === 'yearly') {
      const currentYear = new Date().getFullYear();
      setSelectedYear(currentYear.toString());
      setSpecificFilter(currentYear.toString());
    }
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

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
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
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {filter === 'all' ? 'All Time' : filter === 'weekly' ? 'Weekly' : filter === 'monthly' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>

          {timeFilter !== 'all' && (
            <div className="space-y-4">
              {timeFilter === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Week</label>
                  <input
                    type="week"
                    value={selectedWeek}
                    onChange={(e) => handleWeekChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}
              {timeFilter === 'monthly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
                  <input
                    type="month"
                    value={monthInputValue}
                    onChange={(e) => {
                      setMonthInputValue(e.target.value);
                      setSpecificFilter(e.target.value);
                    }}
                    className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-md"
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
                    maxDate={new Date()}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Store Appointment Statistics</h2>
            <div className="h-96">
              <Bar
                data={getStoreAppointmentChartData()}
                options={{
                  ...chartOptions,
                  plugins: { ...chartOptions.plugins, title: { display: true, text: 'Store Appointments' } },
                }}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Store Revenue Statistics</h2>
            <div className="h-96">
              <Bar
                data={getStoreRevenueChartData()}
                options={{
                  ...chartOptions,
                  plugins: { ...chartOptions.plugins, title: { display: true, text: 'Store Revenue' } },
                }}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Statistics</h2>
            <div className="h-96">
              <Bar
                data={getCustomerChartData()}
                options={{
                  ...chartOptions,
                  plugins: { ...chartOptions.plugins, title: { display: true, text: 'Customer Appointments' } },
                }}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Staff Statistics</h2>
            <div className="h-96">
              <Bar
                data={getStaffChartData()}
                options={{
                  ...chartOptions,
                  plugins: { ...chartOptions.plugins, title: { display: true, text: 'Staff Appointments' } },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;