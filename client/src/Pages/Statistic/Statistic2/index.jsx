import React, { useState, useEffect } from 'react';
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
import AppointmentService from '../../../Services/appointment'; 
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WeeklyBookingStats = () => {
  const [selectedWeek, setSelectedWeek] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [specificFilter, setSpecificFilter] = useState('');
  const [busiestDays, setBusiestDays] = useState({}); 
  const [popularTimeSlots, setPopularTimeSlots] = useState({}); 

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'The Busiest Days of the Week for Bookings' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const horizontalBarOptions = {
    indexAxis: 'y', 
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'The Most Popular Time Slots for Appointments' },
    },
    scales: {
      x: { beginAtZero: true },
      y: { ticks: { autoSkip: false } }, 
    },
  };


  const busiestDaysData = {
    labels: Object.keys(busiestDays),
    datasets: [
      {
        label: `Bookings (${specificFilter || 'Current Week'})`,
        data: Object.values(busiestDays), 
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  
  const timeSlotsData = {
    labels: Object.keys(popularTimeSlots),
    datasets: [
      {
        label: `Appointments (${specificFilter || 'Current Week'})`,
        data: Object.values(popularTimeSlots), 
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const handleWeekChange = (weekString) => {
    if (!weekString) {
      setStartDate('');
      setEndDate('');
      setSpecificFilter('');
      setBusiestDays({});
      setPopularTimeSlots({});
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
    setSelectedWeek(weekString);
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


  useEffect(() => {
    const currentWeek = getCurrentWeek();
    setSelectedWeek(currentWeek);
    handleWeekChange(currentWeek);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedWeek) {
        const [year, week] = selectedWeek.split('-W');
        try {
          const busiestDaysResponse = await AppointmentService.getBusiestDays(year, parseInt(week));
          setBusiestDays(busiestDaysResponse.data);
          const timeSlotsResponse = await AppointmentService.getPopularTimeSlots(year, parseInt(week));
          setPopularTimeSlots(timeSlotsResponse.data);
        } catch (error) {
          console.error("Error fetching data from backend:", error);
          setBusiestDays({
            "Monday": 0,
            "Tuesday": 0,
            "Wednesday": 0,
            "Thursday": 0,
            "Friday": 0,
            "Saturday": 0,
            "Sunday": 0,
          });
          setPopularTimeSlots({
            "07:00-08:00": 0,
            "08:00-09:00": 0,
            "09:00-10:00": 0,
            "10:00-11:00": 0,
            "11:00-12:00": 0,
            "12:00-13:00": 0,
            "13:00-14:00": 0,
            "14:00-15:00": 0,
            "15:00-16:00": 0,
            "16:00-17:00": 0,
            "17:00-18:00": 0,
            "18:00-19:00": 0,
            "19:00-20:00": 0,
            "20:00-21:00": 0,
            "21:00-22:00": 0,
          });
        }
      }
    };
    fetchData();
  }, [selectedWeek]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Weekly Booking Statistics</h1>

        {/* Bộ lọc tuần */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Week</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Week</label>
              <input
                type="week"
                value={selectedWeek}
                onChange={(e) => handleWeekChange(e.target.value)}
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-96">
              <Bar data={busiestDaysData} options={barOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-96">
              <Bar data={timeSlotsData} options={horizontalBarOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyBookingStats;