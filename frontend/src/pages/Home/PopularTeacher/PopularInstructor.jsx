import React, { useEffect, useState } from "react";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import { FaFacebook, FaInstagram, FaLinkedin, FaStar, FaUsers } from "react-icons/fa";
import img from '../../../assets/home/girl.jpg'

const PopularInstructor = () => {
  const [instructors, setInstructors] = useState([]);
  console.log(instructors);
  const axiosFetch = useAxiosFetch();

  useEffect(() => {
    axiosFetch
      .get("/popular-instructors")
      .then((data) => {
        setInstructors(data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #92400e 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="relative z-10 py-20 px-4">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <span className="inline-block w-16 h-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full"></span>
            <span className="inline-block w-8 h-1 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-full ml-2"></span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-amber-800 via-orange-700 to-yellow-800 bg-clip-text text-transparent">
              Our Amazing
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-800 via-amber-700 to-orange-800 bg-clip-text text-transparent">
              Teachers
            </span>
          </h1>
          
          <p className="text-xl text-amber-800/80 max-w-2xl mx-auto leading-relaxed">
            Meet our exceptional educators who inspire and guide students to achieve their dreams. 
            Each instructor brings years of expertise and passion to create transformative learning experiences.
          </p>
          
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-6 text-amber-700">
              <div className="flex items-center space-x-2">
                <FaStar className="text-yellow-500" />
                <span className="font-semibold">Top Rated</span>
              </div>
              <div className="w-1 h-1 bg-amber-600 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <FaUsers className="text-orange-600" />
                <span className="font-semibold">Expert Instructors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructors Grid */}
        {instructors && instructors.length > 0 ? (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {instructors?.map((instructor, i) => (
                <div
                  key={i}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 border border-amber-100/50 overflow-hidden"
                >
                  {/* Card Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-yellow-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-yellow-200/20 to-amber-200/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    {/* Profile Image */}
                    <div className="relative mb-6 mx-auto w-fit">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse opacity-20 scale-110"></div>
                      <img
                        className="relative rounded-full w-24 h-24 mx-auto object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-500"
                        src={instructor?.instructor?.photoUrl || img}
                        alt={instructor?.instructor?.name || "Instructor"}
                      />
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                        <FaStar className="inline w-3 h-3" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-3">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-amber-800 to-orange-800 bg-clip-text text-transparent">
                        {instructor?.instructor?.name}
                      </h3>
                      
                      <div className="inline-block px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
                        <span className="text-amber-800 font-semibold text-sm">Expert Instructor</span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-2 text-amber-700">
                        <FaUsers className="w-4 h-4" />
                        <span className="font-semibold">{instructor?.totalEnrolled} Students</span>
                      </div>
                      
                      {/* Social Links */}
                      <div className="flex justify-center space-x-4 pt-4">
                        <a 
                          href="#" 
                          className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg"
                        >
                          <FaLinkedin className="w-4 h-4" />
                        </a>
                        <a 
                          href="#" 
                          className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg"
                        >
                          <FaFacebook className="w-4 h-4" />
                        </a>
                        <a 
                          href="#" 
                          className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg"
                        >
                          <FaInstagram className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Call to Action */}
            <div className="text-center mt-16">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <span className="relative z-10">View All Instructors</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FaUsers className="w-10 h-10 text-amber-700" />
              </div>
              <h3 className="text-2xl font-bold text-amber-800 mb-4">No Instructors Available</h3>
              <p className="text-amber-700/80">Check back soon for our amazing teaching staff!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularInstructor;