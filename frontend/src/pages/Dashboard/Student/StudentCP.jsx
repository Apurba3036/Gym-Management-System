import React, { useContext } from 'react';
import { useUser } from '../../../hooks/useUser';

import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { FaDumbbell, FaRegCalendarAlt, FaHistory, FaTasks } from 'react-icons/fa';
import { AuthContext } from '../../../utilities/providers/AuthProvider';

// Mock performance data - replace with real data from your API
const workoutData = [
  { day: 'Mon', calories: 320, duration: 45 },
  { day: 'Tue', calories: 445, duration: 60 },
  { day: 'Wed', calories: 280, duration: 35 },
  { day: 'Thu', calories: 520, duration: 75 },
  { day: 'Fri', calories: 390, duration: 50 },
  { day: 'Sat', calories: 610, duration: 90 },
  { day: 'Sun', calories: 180, duration: 25 },
];

const progressData = [
  { month: 'Jan', weight: 75, muscle: 45 },
  { month: 'Feb', weight: 74, muscle: 46 },
  { month: 'Mar', weight: 73, muscle: 47 },
  { month: 'Apr', weight: 72, muscle: 48 },
  { month: 'May', weight: 71, muscle: 49 },
];

const StudentCP = () => {
  const { currentUser } = useUser();
   const { user, logout } = useContext(AuthContext);
   console.log(user.photoURL);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <img
            onContextMenu={(e) => e.preventDefault()}
            className="h-40 w-auto"
            src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/4140/4140042.png"}
            alt="Welcome"
          />
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
              Hi, <span className="text-secondary italic">{currentUser.name}</span>!
            </h1>
            <p className="mt-2 text-gray-600">
              Welcome back to your <span className="font-semibold">Gym Dashboard</span>.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/dashboard/enrolled-packages"
            className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow hover:shadow-md transition"
          >
            <FaRegCalendarAlt size={24} />
            <span className="ml-3 font-medium">My Enroll</span>
          </Link>
          <Link
            to="/dashboard/my-selected"
            className="flex items-center p-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl shadow hover:shadow-md transition"
          >
            <FaDumbbell size={24} />
            <span className="ml-3 font-medium">My Selected</span>
          </Link>
          <Link
            to="/dashboard/my-payments"
            className="flex items-center p-4 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-xl shadow hover:shadow-md transition"
          >
            <FaHistory size={24} />
            <span className="ml-3 font-medium">Payment History</span>
          </Link>
          <Link
            to="/dashboard/my-task"
            className="flex items-center p-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-xl shadow hover:shadow-md transition"
          >
            <FaTasks size={24} />
            <span className="ml-3 font-medium">My Tasks</span>
          </Link>
        </div>

        {/* Workout Bar Chart */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Weekly Calories & Duration</h2>
          <div className="w-full h-64 bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg shadow-inner">
            <ResponsiveContainer>
              <BarChart data={workoutData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '8px' }} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="calories" name="Calories" barSize={24} fill="#f56565" />
                <Bar dataKey="duration" name="Duration (min)" barSize={24} fill="#4299e1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Line Chart */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Monthly Weight & Muscle Progress</h2>
          <div className="w-full h-64 bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg shadow-inner">
            <ResponsiveContainer>
              <LineChart data={progressData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '8px' }} />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="#805ad5"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="muscle"
                  name="Muscle (%)"
                  stroke="#48bb78"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCP;
