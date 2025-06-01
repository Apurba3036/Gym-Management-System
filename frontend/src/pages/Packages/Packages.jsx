import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaUser, 
    FaCalendarAlt, 
    FaUsers, 
    FaDollarSign, 
    FaEye, 
    FaShoppingCart, 
    FaCheckCircle, 
    FaTimesCircle,
    FaCrown,
    FaFire,
    FaStar
} from 'react-icons/fa';
import { Transition } from '@headlessui/react';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import { useUser } from '../../hooks/useUser';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Link } from 'react-router-dom';

const Packages = () => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const { currentUser } = useUser();
    const role = currentUser?.role;
    const [enrolledPackages, setEnrolledPackages] = useState([]);
    const [Packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosFetch = useAxiosFetch();
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                const res = await axiosFetch.get('/Packages');
                setPackages(res.data || []);
            } catch (err) {
                console.log(err);
                setPackages([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    useEffect(() => {
        if (currentUser) {
            axiosSecure.get(`/myenrolled/${currentUser.email}`)
                .then(res => setEnrolledPackages(res.data))
                .catch(err => console.log(err));
        }
    }, [currentUser, axiosSecure]);

    const handleHover = (index) => {
        setHoveredCard(index);
    };

    const handleSelect = (id, name, image, description, instructorName, price) => {
        if (!currentUser) {
            return toast.error("Please log in to select a package");
        }

        const allEnrolledPackageIds = enrolledPackages.flatMap(item => item.PackagesId);
        if (allEnrolledPackageIds.includes(id)) {
            return toast.error("You are already enrolled in this package");
        }

        addToCart(id, name, image, description, instructorName, price);
    };

    const addToCart = (id, name, image, description, instructorName, price) => {
        axiosSecure.get(`/cart-item/${id}?email=${currentUser?.email}`)
            .then((res) => {
                if (res.data && res.data.packageId === id) {
                    return toast.error("You have already selected this package");
                }

                const selectedPackage = {
                    userId: currentUser._id,
                    userMail: currentUser.email,
                    packageId: id,
                    name,
                    image,
                    description,
                    instructorName,
                    price,
                    date: new Date(),
                };

                toast.promise(
                    axiosSecure.post('/add-to-cart', selectedPackage)
                        .then(() => {
                            toast.success("Package added to cart successfully!");
                        })
                        .catch((err) => {
                            console.error(err);
                            toast.error("Failed to add package to cart");
                        }),
                    {
                        pending: 'Processing your request...',
                        error: 'Something went wrong!',
                    }
                );
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to check package selection status");
            });
    };

    const calculateDateDifference = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const yearsDiff = end.getFullYear() - start.getFullYear();
        const monthsDiff = end.getMonth() - start.getMonth() + (yearsDiff * 12);
        const daysDiff = end.getDate() - start.getDate();

        let months = monthsDiff;
        let days = daysDiff;

        if (days < 0) {
            months -= 1;
            days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
        }

        return { months, days };
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const headerVariants = {
        hidden: { y: -50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 10
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full mb-4"
                />
                <p className="text-gray-600 dark:text-gray-400">Loading packages...</p>
            </div>
        );
    }

    // Show message if no packages found
    if (!loading && Packages.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <motion.div 
                    className="pt-24 pb-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">No Packages Available</h1>
                    <p className="text-gray-600 dark:text-gray-400">Please check back later for new packages.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header Section */}
            <motion.div 
                className="pt-24 pb-8 text-center relative overflow-hidden"
                variants={headerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/10 dark:to-purple-400/10" />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="relative z-10"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <FaCrown className="text-4xl text-yellow-500" />
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Premium Packages
                        </h1>
                        <FaFire className="text-4xl text-red-500" />
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Transform your fitness journey with our expertly designed workout packages
                    </p>
                </motion.div>
            </motion.div>

            {/* Packages Grid */}
            <motion.div 
                className="pb-16 mt-12 px-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {Packages.map((Pac, index) => {
                            const { months, days } = calculateDateDifference(Pac.submitted, Pac.finishedDate);
                            const isUnavailable = Pac.availableSeats < 1;
                            const isEnrolled = enrolledPackages.flatMap(item => item.PackagesId).includes(Pac._id);
                            
                            return (
                                <motion.div
                                    key={index}
                                    variants={cardVariants}
                                    whileHover={{ 
                                        y: -8, 
                                        scale: 1.02,
                                        boxShadow: "0 20px 40px rgba(0,0,0,0.12)" 
                                    }}
                                    className={`relative w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                                        isUnavailable 
                                            ? 'border-red-200 bg-red-50 dark:bg-red-900/20' 
                                            : isEnrolled 
                                                ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                                                : 'border-transparent hover:border-blue-200 dark:hover:border-blue-700'
                                    }`}
                                    onMouseEnter={() => handleHover(index)}
                                    onMouseLeave={() => handleHover(null)}
                                >
                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4 z-20">
                                        {isUnavailable ? (
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                <FaTimesCircle />
                                                Full
                                            </span>
                                        ) : isEnrolled ? (
                                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-0">
                                                <FaCheckCircle />
                                                Enrolled
                                            </span>
                                        ) : Pac.availableSeats <= 5 ? (
                                            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                <FaFire />
                                                Limited
                                            </span>
                                        ) : null}
                                    </div>

                                    {/* Image Section */}
                                    <div className="relative h-48 overflow-hidden">
                                        <motion.div 
                                            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 z-10 ${
                                                hoveredCard === index ? 'opacity-100' : 'opacity-0'
                                            }`} 
                                        />
                                        <motion.img
                                            src={Pac.image}
                                            alt={Pac.name}
                                            className="w-full h-full object-cover transition-transform duration-300"
                                            whileHover={{ scale: 1.1 }}
                                        />
                                        
                                        {/* Hover Overlay */}
                                        <AnimatePresence>
                                            {hoveredCard === index && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="absolute inset-0 flex items-center justify-center z-20"
                                                >
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleSelect(Pac._id, Pac.name, Pac.image, Pac.description, Pac.instructorName, Pac.price)}
                                                        title={role === 'admin' || role === 'instructor' ? 'Instructor/Admin Cannot Select' : (isUnavailable ? 'No seats available' : 'Add to cart')}
                                                        disabled={role === 'admin' || role === 'instructor' || isUnavailable}
                                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg transition-all duration-200"
                                                    >
                                                        <FaShoppingCart />
                                                        Add to Cart
                                                    </motion.button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2 flex-1">
                                                {Pac.name}
                                            </h3>
                                            <div className="flex items-center text-yellow-400 ml-2">
                                                <FaStar className="text-sm" />
                                                <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">4.8</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                                            <FaUser className="text-blue-500 mr-2" />
                                            <span className="text-sm">Instructor: {Pac.instructorName}</span>
                                        </div>

                                        {/* Package Stats */}
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                    <FaUsers className="text-green-500 mr-2" />
                                                    <span className="text-sm">Available Seats</span>
                                                </div>
                                                <span className={`font-semibold ${isUnavailable ? 'text-red-500' : 'text-green-500'}`}>
                                                    {Pac.availableSeats}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                    <FaCalendarAlt className="text-purple-500 mr-2" />
                                                    <span className="text-sm">Duration</span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                    {months}m {days}d
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                    <FaDollarSign className="text-yellow-500 mr-2" />
                                                    <span className="text-sm">Price</span>
                                                </div>
                                                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                                    ৳{Pac.price}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Link to={`/Packages/${Pac._id}`}>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg"
                                            >
                                                <FaEye />
                                                View Details
                                            </motion.button>
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Packages;