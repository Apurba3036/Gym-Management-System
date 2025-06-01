import React from 'react';

const Hero = () => {
    return (
        <div className='relative pb-10 min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden' 
             style={{ backgroundImage: `url('https://images7.alphacoders.com/130/1308025.jpg')` }}>
            
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
            
            {/* Animated particles effect */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-ping"></div>
                <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
            </div>
            
            <div className="relative min-h-screen flex justify-start pl-8 md:pl-16 lg:pl-20 text-white items-center">
                <div className="max-w-2xl animate-fade-in">
                    <div className="space-y-8 mt-32">
                        {/* Subtitle with glow effect */}
                        <div className="relative">
                            <h3 className='text-lg md:text-2xl font-medium tracking-widest text-orange-400 mb-2 animate-slide-down'>
                                WE PROVIDE
                            </h3>
                            <div className="absolute -bottom-1 left-0 w-16 h-0.5 bg-gradient-to-r from-orange-400 to-transparent"></div>
                        </div>
                        
                        {/* Main title with gradient text */}
                        <h1 className='text-5xl md:text-7xl lg:text-8xl font-black leading-tight animate-slide-up'>
                            <span className="bg-gradient-to-r from-white via-gray-200 to-orange-200 bg-clip-text text-transparent">
                                Best
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
                                Workout
                            </span>
                        </h1>
                        
                        {/* Description */}
                        <p className="text-gray-300 text-lg md:text-xl max-w-lg leading-relaxed animate-fade-in-delayed">
                            Transform your body and mind with our premium fitness programs designed by expert trainers.
                        </p>
    
                        {/* CTA Buttons with enhanced styling */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 animate-slide-up-delayed">
                            <button className='group relative px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 font-bold uppercase text-white shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden'>
                                <span className="relative z-10">Join Today</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            </button>
                            
                            <a href="/packages" className="group">
                                <button className='relative px-8 py-4 rounded-full bg-transparent border-2 border-white/30 backdrop-blur-sm font-bold uppercase text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-white/20'>
                                    <span className="relative z-10">View Packages</span>
                                    <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
                                </button>
                            </a>
                        </div>
                        
                        {/* Stats or features */}
                        <div className="flex flex-wrap gap-8 pt-8 animate-fade-in-delayed">
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-orange-400">500+</div>
                                <div className="text-gray-300 text-sm uppercase tracking-wide">Members</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-orange-400">50+</div>
                                <div className="text-gray-300 text-sm uppercase tracking-wide">Trainers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-orange-400">24/7</div>
                                <div className="text-gray-300 text-sm uppercase tracking-wide">Access</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slide-down {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes slide-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
                
                .animate-slide-down {
                    animation: slide-down 0.8s ease-out;
                }
                
                .animate-slide-up {
                    animation: slide-up 1s ease-out 0.2s both;
                }
                
                .animate-fade-in-delayed {
                    animation: fade-in 1s ease-out 0.4s both;
                }
                
                .animate-slide-up-delayed {
                    animation: slide-up 1s ease-out 0.6s both;
                }
            `}</style>
        </div>
    );
};

export default Hero;