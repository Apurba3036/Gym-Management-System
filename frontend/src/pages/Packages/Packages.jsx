import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import { Transition } from '@headlessui/react';
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
    const axiosFetch = useAxiosFetch();
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        axiosFetch.get('/Packages')
            .then(res => setPackages(res.data))
            .catch(err => console.log(err));
    }, [axiosFetch]);

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

        // Check if the user is already enrolled in the package
        const allEnrolledPackageIds = enrolledPackages.flatMap(item => item.PackagesId);
        if (allEnrolledPackageIds.includes(id)) {
            return toast.error("You are already enrolled in this package");
        }

        // Handle the logic to add the package to the cart
        addToCart(id, name, image, description, instructorName, price);
    };

    const addToCart = (id, name, image, description, instructorName, price) => {
        // Check if the package is already selected in the cart
        axiosSecure.get(`/cart-item/${id}?email=${currentUser?.email}`)
            .then((res) => {
                if (res.data && res.data.packageId === id) {
                    return toast.error("You have already selected this package");
                }

                // Add to cart if not already selected
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

    return (
        <div>
            <div className="mt-20 pt-3">
                <h1 className="text-4xl font-bold text-center text-dark-primary">Packages</h1>
            </div>

            <div className="my-16 w-[90%] gap-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto">
                {Packages.map((Pac, index) => {
                    const { months, days } = calculateDateDifference(Pac.submitted, Pac.finishedDate);
                    return (
                        <div
                            key={index}
                            className={`relative hover:-translate-y-2 duration-150 hover:ring-[2px] hover:ring-secondary w-64 h-[350px] mx-auto ${Pac.availableSeats < 1 ? 'bg-red-300' : 'bg-white'} dark:bg-slate-600 rounded-lg shadow-lg overflow-hidden cursor-pointer`}
                            onMouseEnter={() => handleHover(index)}
                            onMouseLeave={() => handleHover(null)}
                        >
                            <div className="relative h-40">
                                <div className={`absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ${hoveredCard === index ? 'opacity-60' : ''}`} />
                                <img
                                    src={Pac.image}
                                    alt="Course Image"
                                    className="object-cover w-full h-full"
                                />
                                <Transition
                                    show={hoveredCard === index}
                                    enter="transition-opacity duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition-opacity duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <button
                                            onClick={() => handleSelect(Pac._id, Pac.name, Pac.image, Pac.description, Pac.instructorName, Pac.price)}
                                            title={role === 'admin' || role === 'instructor' ? 'Instructor/Admin Cannot Select' : (Pac.availableSeats < 1 ? 'No seats available' : 'You can select this class')}
                                            disabled={role === 'admin' || role === 'instructor' || Pac.availableSeats < 1}
                                            className="px-4 py-2 text-white disabled:bg-red-300 bg-secondary duration-300 rounded hover:bg-red-700"
                                        >
                                            Select
                                        </button>
                                    </div>
                                </Transition>
                            </div>
                            <div className="px-6 py-2">
                                <h3 className={`${Pac.name.length > 25 ? 'text-[14px]' : 'text-[16px]'} font-bold`}>{Pac.name}</h3>
                                <p className="text-gray-500 text-xs">Instructor: {Pac.instructorName}</p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-gray-600 text-xs">Available Seats: <span className='text-secondary'>{Pac.availableSeats}</span></span>
                                    <span className="text-green-500 font-semibold">৳{Pac.price}</span>
                                </div>

                                <p className="text-xs">
                                    Duration: {months} months {days} days
                                </p>

                                <Link to={`/Packages/${Pac._id}`}>
                                    <button className="px-4 py-2 mt-4 mb-5 w-full mx-auto text-white disabled:bg-red-300 bg-secondary duration-300 rounded hover:bg-red-700">
                                        View
                                    </button>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Packages;
