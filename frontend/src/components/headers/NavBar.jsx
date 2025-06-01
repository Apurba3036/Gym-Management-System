import React, { useContext, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaUser, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { FcElectricalSensor } from 'react-icons/fc';
import Swal from 'sweetalert2';
import Switch from '@mui/material/Switch';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utilities/providers/AuthProvider';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const navLinks = [
    {
        name: 'Home',
        route: '/'
    },
    {
        name: 'Instructors',
        route: '/instructors'
    },
    {
        name: 'Packages',
        route: '/Packages'
    }
];

const theme = createTheme({
    palette: {
        primary: {
            main: '#ff0000', // Set the primary color
        },
        secondary: {
            main: '#00ff00', // Set the secondary color
        },
    },
});

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isHome, setIsHome] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [navBg, setNavBg] = useState('bg-[#15151580]');
    const [isFixed, setIsFixed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const profileDropdownRef = useRef(null);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const handelLogout = e => {
        e.preventDefault();
        setIsProfileDropdownOpen(false); // Close dropdown
        Swal.fire({
            title: 'Are you sure to logout ?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Logout.!'
        }).then((result) => {
            if (result.isConfirmed) {
                logout()
                    .then(() => {
                        Swal.fire(
                            'Logged out!',
                            'You are logged out successful.',
                            'success'
                        )
                    })
                    .catch(err => {
                        Swal.fire(
                            'Error!',
                            err.message,
                            'error'
                        )
                    })
            }
        })
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setIsHome(location.pathname === '/');
        setIsLogin(location.pathname === '/login');
        setIsFixed(location.pathname === '/register' || location.pathname === '/login');
    }, [location]);

    useEffect(() => {
        const handleScroll = () => {
            const currentPosition = window.pageYOffset;
            setScrollPosition(currentPosition);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (scrollPosition > 100) {
            if (isHome) {
                setNavBg('bg-white backdrop-filter backdrop-blur-xl bg-opacity-0 dark:bg-black dark:text-white text-black');
            }
            else {
                setNavBg('bg-white dark:bg-black dark:text-white text-black');
            }
        } else {
            setNavBg(`${isHome || location.pathname === '/' ? 'bg-transparent' : 'bg-white dark:bg-black'} dark:text-white text-white`);
        }
    }, [scrollPosition]);

    return (
        <motion.nav
            className={`${isHome ? navBg : 'bg-white dark:bg-black backdrop-blur-2xl'}  ${isFixed ? 'static' : 'fixed'} top-0 transition-colors duration-500 ease-in-out  w-full z-50`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="lg:w-[95%] mx-auto sm:px-6 lg:px-6">
                <div className="flex px-4 items-center justify-between py-4">
                    {/* Logo */}
                    <div onClick={() => navigate('/')} className="flex-shrink-0 cursor-pointer pl-7 md:p-0 flex items-center">
                        <div className="flex items-center gap-4">
                            <img src="/gymlogo.png" alt="BacBon Gym Center" className='w-12 h-12' />
                            <div>
                                <h1 className='text-3xl font-Cinzel font-bold'>BacBon Gym Center</h1>
                                <p className='font-bold text-[13px] tracking-[8px]'>Quick Explore</p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Icon */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMobileMenu}
                            type="button"
                            className="text-gray-300 hover:text-white focus:outline-none"
                        >
                            <FaBars className="h-6  hover:text-primary w-6" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden  text-black dark:text-white md:block">
                        <div className="flex">
                            <ul className="ml-10 flex items-center space-x-4 pr-4">
                                {navLinks.map((link) => (
                                    <li key={link.route}>
                                        <NavLink
                                            className={({ isActive }) => `font-bold ${isActive ? 'text-secondary' : `${navBg.includes('bg-transparent') ? 'text-white' : 'text-black dark:text-white'}`} hover:text-secondary duration-300`}
                                            to={link.route}
                                            style={{ whiteSpace: 'nowrap' }}
                                        >
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}
                                {
                                    user ? null : isLogin ? <li>
                                        <NavLink
                                            to='/register'
                                            className={({ isActive }) => `font-bold ${isActive ? 'text-secondary' : `${navBg.includes('bg-transparent') ? 'text-white' : 'text-black dark:text-white'}`} hover:text-secondary duration-300`}
                                        >Register</NavLink></li> : <li>
                                        <NavLink
                                            to='/login'
                                            className={({ isActive }) => `font-bold ${isActive ? 'text-secondary' : `${navBg.includes('bg-transparent') ? 'text-white' : 'text-black dark:text-white'}`} hover:text-secondary duration-300`}
                                        >Login</NavLink></li>
                                }
                                
                                {/* Profile Dropdown */}
                                {user && (
                                    <li className="relative" ref={profileDropdownRef}>
                                        <button
                                            onClick={toggleProfileDropdown}
                                            className="flex items-center focus:outline-none"
                                        >
                                            <img 
                                                src={user?.photoURL? user?.photoURL : 'https://cdn-icons-png.flaticon.com/512/9385/9385289.png'} 
                                                className='h-[40px] rounded-full w-[40px] border-2 border-secondary hover:border-primary transition-colors duration-300' 
                                                alt="Profile" 
                                            />
                                        </button>
                                        
                                        {/* Dropdown Menu */}
                                        <AnimatePresence>
                                            {isProfileDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
                                                >
                                                    <NavLink
                                                        to='/dashboard'
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                    >
                                                        <FaTachometerAlt className="mr-3 text-blue-500" />
                                                        Dashboard
                                                    </NavLink>
                                                    <button
                                                        onClick={handelLogout}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                                    >
                                                        <FaSignOutAlt className="mr-3 text-red-500" />
                                                        Logout
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </li>
                                )}
                                
                                <li>
                                    <ThemeProvider theme={theme}>
                                        <div className="flex flex-col justify-center items-center">
                                            <Switch onChange={() => setIsDarkMode(!isDarkMode)} />
                                            <h1 className='text-[8px]'>Light/Dark</h1>
                                        </div>
                                    </ThemeProvider>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className="md:hidden mt-2 w-full bg-black"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ul className="px-4 py-2 space-y-2">
                                {navLinks.map((link) => (
                                    <li key={link.route}>
                                        <NavLink
                                            className={({ isActive }) => `font-bold block py-2 ${isActive ? 'text-secondary' : 'text-white'} hover:text-secondary duration-300`}
                                            to={link.route}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}
                                {
                                    user ? null : isLogin ? 
                                    <li>
                                        <NavLink
                                            to='/register'
                                            className="font-bold block py-2 text-white hover:text-secondary duration-300"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >Register</NavLink>
                                    </li> : 
                                    <li>
                                        <NavLink
                                            to='/login'
                                            className="font-bold block py-2 text-white hover:text-secondary duration-300"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >Login</NavLink>
                                    </li>
                                }
                                {user && (
                                    <>
                                        <li>
                                            <NavLink 
                                                to='/dashboard' 
                                                className="flex items-center font-bold py-2 text-white hover:text-secondary duration-300"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <FaTachometerAlt className="mr-3" />
                                                Dashboard
                                            </NavLink>
                                        </li>
                                        <li>
                                            <div className="flex items-center py-2">
                                                <img src={user?.photoURL} className='h-[40px] rounded-full w-[40px] mr-3' alt="Profile" />
                                                <span className="text-white text-sm">{user?.displayName || user?.email}</span>
                                            </div>
                                        </li>
                                        <li>
                                            <button 
                                                className='flex items-center font-bold py-2 text-white hover:text-red-400 duration-300'
                                                onClick={handelLogout}
                                            >
                                                <FaSignOutAlt className="mr-3" />
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default NavBar;