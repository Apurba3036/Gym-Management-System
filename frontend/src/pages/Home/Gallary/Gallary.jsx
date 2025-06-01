import React, { useState } from "react";

const Gallery = () => {
  const [hoveredImage, setHoveredImage] = useState(null);
  
  // Using placeholder images for demo - replace with your actual imports
  const images = [
    { id: 1, src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80", alt: "Gym Equipment" },
    { id: 2, src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80", alt: "Personal Training" },
    { id: 3, src: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80", alt: "Cardio Area" },
    { id: 4, src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80", alt: "Weight Training" },
    { id: 5, src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80", alt: "Group Classes" }
  ];

  return (
    <div className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-block">
            <h2 className="text-lg font-semibold text-orange-600 mb-2 tracking-wide uppercase">
              Explore Our Space
            </h2>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                Our 
              </span>
              <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent ml-4">
                Gallery
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 mx-auto rounded-full"></div>
          </div>
          <p className="text-gray-600 text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
            Step into our world-class fitness facility and discover the perfect environment for your transformation journey.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-[800px]">
          {/* Large Feature Image */}
          <div className="lg:col-span-2 group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700">
            <div 
              className="relative h-64 md:h-96 lg:h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-1000 ease-out"
              style={{ backgroundImage: `url('${images[0].src}')` }}
              onMouseEnter={() => setHoveredImage(0)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">Main Training Floor</h3>
                <p className="text-gray-200 text-sm md:text-base">State-of-the-art equipment for all your fitness needs</p>
              </div>
              {hoveredImage === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-0 animate-ping">
                    <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Small Images Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
            {images.slice(1).map((image, index) => (
              <div 
                key={image.id}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                onMouseEnter={() => setHoveredImage(index + 1)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <div 
                  className="h-48 lg:h-44 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700 ease-out relative"
                  style={{ backgroundImage: `url('${image.src}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Image Label */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="text-white text-sm font-semibold truncate">{image.alt}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "5000+", label: "Sq Ft Space" },
            { number: "200+", label: "Equipment" },
            { number: "50+", label: "Classes" },
            { number: "24/7", label: "Access" }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .hover\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default Gallery;