import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { useUser } from '../../../../hooks/useUser';
import { Pagination, ThemeProvider, createTheme } from '@mui/material';
import { ScaleLoader } from 'react-spinners';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRegEye } from 'react-icons/fa';

const EnrolledPackages = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const { currentUser } = useUser();
    const itemPerPage = 2;
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const theme = createTheme({
        palette: {
            primary: { main: '#FF1949' },
        },
    });

    useEffect(() => {
        axiosSecure.get(`/myenrolled/${currentUser.email}`)
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => console.log(err));
    }, [currentUser.email, axiosSecure]);

    useEffect(() => {
        const lastIndex = page * itemPerPage;
        const firstIndex = lastIndex - itemPerPage;
        const currentData = data.slice(firstIndex, lastIndex);
        setPaginatedData(currentData);
    }, [page, data]);

    const handleChange = (event, value) => setPage(value);

    const handleDetailsClick = (PackagesId) => {
        navigate(`/Packages/${PackagesId}`);
    };

    if (loading) {
        return (
            <div className='h-screen w-full flex justify-center items-center'>
                <ScaleLoader color="#FF1949" height={40} radius={2} />
            </div>
        );
    }

    return (
        <div className="px-4 py-10 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800">My <span className="text-secondary">Enrolled</span> Packages</h1>
                <p className="text-gray-500 mt-2">Here you can track the packages you've enrolled in.</p>
            </motion.div>

            <div className="overflow-x-auto shadow rounded-lg">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-secondary text-white">
                        <tr>
                            <th className="px-4 py-3">Package</th>
                            <th className="px-4 py-3">Instructor</th>
                            <th className="px-4 py-3">Enrolled Date</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {paginatedData.flatMap((item) =>
                            item.PackagesNames.map((packageName, index) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    transition={{ delay: index * 0.1 }} 
                                    key={`${item._id}-${index}`} 
                                    className="border-b hover:bg-gray-50 transition-all"
                                >
                                    <td className="px-4 py-2">{packageName}</td>
                                    <td className="px-4 py-2">{item.InstructorsNames[index]}</td>
                                    <td className="px-4 py-2">{moment(item.enrolleddate).format('MMMM Do YYYY')}</td>
                                    {index === 0 && (
                                        <td className="px-4 py-2 font-semibold text-green-600" rowSpan={item.PackagesNames.length}>
                                            ৳{item.price}
                                        </td>
                                    )}
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                                            onClick={() => handleDetailsClick(item.PackagesId[index])}
                                        >
                                            <FaRegEye />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ThemeProvider theme={theme}>
                <div className="flex justify-center items-center my-8">
                    <Pagination count={Math.ceil(data.length / itemPerPage)} page={page} onChange={handleChange} color="primary" />
                </div>
            </ThemeProvider>

            <div className="text-center text-sm text-gray-500">
                Showing page <span className="text-secondary font-bold">{page}</span> of <span className="text-secondary font-bold">{Math.ceil(data.length / itemPerPage)}</span>
            </div>
        </div>
    );
};

export default EnrolledPackages;
