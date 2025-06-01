import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import Card from './Card';

const PopularPackages = () => {
    const axiosFetch = useAxiosFetch();
    const [Packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                const response = await axiosFetch.get('/popular-Packages');
                setPackages(response.data);
            } catch (error) {
                console.error('Error fetching packages:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);
    
    console.log(Packages);
    
    return (
        <div className='relative py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden'>
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-10 w-4 h-4 bg-orange-400 rounded-full opacity-20 animate-bounce"></div>
                <div className="absolute top-1/3 right-20 w-3 h-3 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
                <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-25 animate-pulse"></div>
                <div className="absolute top-2/3 right-1/3 w-5 h-5 bg-green-400 rounded-full opacity-20 animate-bounce"></div>
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-20">
                    <div className="inline-block relative">
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-orange-400 opacity-60"></div>
                        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-orange-400 opacity-60"></div>
                        
                        <h2 className="text-lg font-semibold text-orange-600 mb-4 tracking-wide uppercase relative">
                            <span className="relative z-10">⭐ Most Loved Programs</span>
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-orange-400"></div>
                        </h2>
                        
                        <h1 className='text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight'>
                            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                                Our 
                            </span>
                            <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent ml-4">
                                Popular
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                                Packages
                            </span>
                        </h1>
                        
                        <div className="w-32 h-1 bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 mx-auto rounded-full mb-6"></div>
                    </div>
                    
                    <div className="max-w-3xl mx-auto">
                        <p className='text-gray-600 text-xl leading-relaxed mb-8'>
                            Explore our most popular fitness packages, carefully selected based on member enrollment and satisfaction. 
                            <span className="text-orange-600 font-semibold"> Join thousands of satisfied members</span> who have transformed their lives with our programs.
                        </p>
                        
                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-8 mb-12">
                            <div className="text-center">
                                <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                                    {Packages.length}+
                                </div>
                                <div className="text-gray-500 text-sm uppercase tracking-wide">Popular Programs</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                                    {Packages.reduce((sum, pkg) => sum + (pkg.totalEnrolled || 0), 0)}+
                                </div>
                                <div className="text-gray-500 text-sm uppercase tracking-wide">Happy Members</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                                    4.9★
                                </div>
                                <div className="text-gray-500 text-sm uppercase tracking-wide">Average Rating</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-orange-200 rounded-full animate-spin"></div>
                            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div>
                        </div>
                    </div>
                )}

                {/* Packages Grid */}
                {!loading && (
                    <div className="relative">
                        {/* Grid Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="grid grid-cols-6 gap-4 h-full">
                                {[...Array(24)].map((_, i) => (
                                    <div key={i} className="bg-gray-300 rounded"></div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="relative grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                            {Packages.map((item, index) => (
                                <div 
                                    key={item._id || index}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <Card 
                                        id={item._id} 
                                        availableSeats={item.availableSeats} 
                                        price={item.price} 
                                        name={item.name} 
                                        image={item.image} 
                                        totalEnrolled={item.totalEnrolled} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Call to Action */}
               
            </div>
            
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
};

export default PopularPackages;