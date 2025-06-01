import React, { useEffect, useState } from 'react';
import { useUser } from '../../../hooks/useUser';
import { FaTasks, FaRegListAlt, FaInbox } from 'react-icons/fa';
import moment from 'moment';
import { useTitle } from '../../../hooks/useTitle';

const MyTask = () => {
useTitle('My Task| BacBon Gym Centers- Unleashed Your Inner Self');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, isLoading } = useUser();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!currentUser?.email) throw new Error('User email is not available');

        const res = await fetch(
          `http://localhost:5000/api/studenttask?email=${currentUser.email}`
        );
        const data = await res.json();

        if (!res.ok) {
          // Treat "no tasks" as empty state rather than error
          if (data.message && data.message.includes('No tasks')) {
            setTasks([]);
          } else {
            throw new Error(data.message || 'Failed to fetch tasks');
          }
        } else {
          setTasks(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentUser]);

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-gray-500">
          <FaRegListAlt className="animate-spin text-3xl mx-auto" />
          <p className="mt-2">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    // Show real errors only
    if (error.includes('No tasks')) {
      // fall through to empty state
    } else {
      return <div className="text-center text-red-500 mt-8">Error: {error}</div>;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-6">
          <FaTasks className="mr-2 text-secondary" /> My Tasks
        </h2>

        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaInbox size={64} className="text-gray-400" />
            <p className="mt-4 text-gray-500 text-lg">You have no tasks at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-2xl shadow p-6 border border-gray-200 hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.packageName}</h3>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Instructor:</span> {task.instructorname}
                </p>
                <p className="text-gray-600 mb-3 max-h-24 overflow-auto">
                  <span className="font-medium">Message:</span> {task.message}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Instructor Email:</span> {task.instructoremail}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Date:</span>{' '}
                  {task.date ? moment(task.date).format('MMMM Do YYYY') : 'Not Available'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTask;
