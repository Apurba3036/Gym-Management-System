import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useUser } from '../../../hooks/useUser';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { FaEye, FaUserGraduate, FaEdit } from 'react-icons/fa';

const MyPackages = () => {
  const [Packages, setPackages] = useState([]);
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (!isLoading) {
      axiosSecure.get(`/Packages/${currentUser?.email}`)
        .then(res => setPackages(res.data))
        .catch(err => console.log(err));
    }
  }, [isLoading]);

  const handleFeedback = (id) => {
    const thePackage = Packages.find(pac => pac._id === id);
    if (thePackage.reason) {
      Swal.fire('Reason For Rejected', thePackage.reason, 'info');
    } else {
      Swal.fire('Wow Looks Good', 'Your package is approved', 'success');
    }
  };

  

  return (
    <div className="my-10 px-4 md:px-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center text-gray-800"
      >
        My <span className="text-secondary">Courses</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-sm mt-2 text-gray-500"
      >
        View all your submitted packages and related details here
      </motion.p>

      {Packages.length === 0 ? (
        <div className="text-center text-xl font-semibold mt-16 text-gray-600">
          You have not added any package yet.
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {Packages.map((Pac, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col md:flex-row items-center bg-white shadow-xl rounded-xl overflow-hidden hover:ring-2 ring-secondary transition duration-300"
            >
              <img
                className="w-full md:w-60 h-60 object-cover"
                src={Pac.image}
                alt={Pac.name}
              />
              <div className="flex-1 p-6 w-full">
                <h2 className="text-xl font-bold text-secondary border-b pb-2 mb-4">
                  {Pac.name}
                </h2>
                <div className="flex flex-col md:flex-row justify-between text-sm">
                  <div>
                    <p><span className="font-semibold text-gray-700">Total Students:</span> {Pac.totalEnrolled || 0}</p>
                    <p><span className="font-semibold text-gray-700">Total Seats:</span> {Pac.availableSeats}</p>
                    <p>
                      <span className="font-semibold text-gray-700">Status:</span>{' '}
                      <span className={`font-bold ${
                        Pac.status === 'pending' ? 'text-yellow-500' :
                        Pac.status === 'checking' ? 'text-yellow-400' :
                        Pac.status === 'approved' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Pac.status}
                      </span>
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <p><span className="font-semibold text-gray-700">Price:</span> {Pac.price}৳</p>
                    <p>
                      <span className="font-semibold text-gray-700">Submitted:</span>{' '}
                      {Pac.submitted ? moment(Pac.submitted).format('MMMM Do YYYY') : 'Not Available'}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 space-y-2">
                    <button
                      onClick={() => handleFeedback(Pac._id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition"
                    >
                      <FaEye /> View Feedback
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/view/${Pac._id}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <FaUserGraduate /> View Students
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/update/${Pac._id}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary transition"
                    >
                      <FaEdit /> Update
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPackages;
