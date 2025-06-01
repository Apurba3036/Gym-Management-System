import React, { useContext, useEffect, useState } from 'react';
import { useUser } from '../../../hooks/useUser';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { motion } from 'framer-motion';
import { FaDumbbell, FaCalendarCheck, FaFireAlt } from 'react-icons/fa';
import { AuthContext } from '../../../utilities/providers/AuthProvider';
import { useTitle } from '../../../hooks/useTitle';

const InstructorCP = () => {
    const { user } = useContext(AuthContext);
    console.log(user);
  useTitle('Instructor CP | BacBon Gym Center - Unleashed Your Inner Self');
  const { currentUser, isLoading } = useUser();
  const axiosSecure = useAxiosSecure();
  const [packages, setPackages] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    if (currentUser?.email) {
      axiosSecure.get(`/Packages/${currentUser.email}`)
        .then(res => {
          setPackages(res.data);
          const total = res.data.reduce((sum, pkg) => sum + (pkg.totalEnrolled || 0), 0);
          setTotalStudents(total);
        })
        .catch(err => console.error(err));
    }
  }, [currentUser?.email, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-xl rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 max-w-5xl w-full"
      >
        {/* Instructor Profile Image */}
        <img
          src={user?.photoURL}
          alt="Instructor"
          className="w-40 h-40 rounded-full object-cover border-4 border-gray-300"
        />

        {/* Info Section */}
        <div className="text-center md:text-left w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Welcome, {user?.displayName || 'Instructor'} 💪
          </h1>
          <p className="text-gray-600 text-lg mb-4">{currentUser?.email}</p>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-gray-700">
            <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-4 shadow">
              <FaDumbbell className="text-2xl text-blue-600" />
              <div>
                <p className="text-sm">Total Packages</p>
                <p className="font-bold text-lg">{packages.length}</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-4 shadow">
              <FaFireAlt className="text-2xl text-red-500" />
              <div>
                <p className="text-sm">Total Students</p>
                <p className="font-bold text-lg">{totalStudents}</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-4 shadow">
              <FaCalendarCheck className="text-2xl text-green-600" />
              <div>
                <p className="text-sm">Active Sessions</p>
                <p className="font-bold text-lg">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InstructorCP;
