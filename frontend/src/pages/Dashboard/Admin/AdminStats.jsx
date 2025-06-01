import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Slide } from 'react-awesome-reveal';
import { motion } from 'framer-motion';
import { FaUsers, FaRegListAlt, FaChartPie, FaMoneyBillWave, FaDownload } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import moment from 'moment';

// Extended color palette
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFD',
  '#FF6699', '#66CCFF', '#FF6666', '#66FF66', '#6666FF'
];

export default function AdminStats({ users = [] }) {
  const axiosSecure = useAxiosSecure();
  const axiosFetch = useAxiosFetch();
  const [data, setData] = useState({});
  const [payments, setPayments] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const statsRef = useRef(null);
  const hasLoadedRef = useRef(false);

  // State for tracking library loading
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [libraryLoadError, setLibraryLoadError] = useState(null);

  // Load external libraries once
  useEffect(() => {
    const loadExternalLibraries = async () => {
      try {
        // Check if libraries are already loaded
        if (window.html2canvas && window.jsPDF) {
          setLibrariesLoaded(true);
          return;
        }

        const loadScript = (src, integrity = null) => {
          return new Promise((resolve, reject) => {
            // Check if script already exists
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
              resolve();
              return;
            }

            const script = document.createElement('script');
            script.src = src;
            if (integrity) {
              script.integrity = integrity;
              script.crossOrigin = 'anonymous';
            }
            
            script.onload = () => resolve();
            script.onerror = (error) => reject(new Error(`Failed to load ${src}`));
            
            document.head.appendChild(script);
          });
        };

        // Load html2canvas
        if (!window.html2canvas) {
          await loadScript(
            'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
            'sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA=='
          );
        }

        // Load jsPDF
        if (!window.jsPDF) {
          await loadScript(
            'https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.1/jspdf.umd.min.js',
            'sha512-qZvrmS2ekKPF2mSznTQsxqPgnpkI4DNhh7Wp2ywVLRIcYuVMoWG0T2AUILAGFg4vMNQnJ8EhEL9OAlVi6BdxrA=='
          );
        }

        // Wait a bit for libraries to initialize
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify libraries are loaded
        if (window.html2canvas && window.jsPDF) {
          setLibrariesLoaded(true);
          console.log('PDF libraries loaded successfully');
        } else {
          throw new Error('Libraries loaded but not accessible');
        }

      } catch (error) {
        console.error('Error loading PDF libraries:', error);
        setLibraryLoadError(error.message);
      }
    };

    loadExternalLibraries();
  }, []); // Empty dependency array - only run once

  // Memoized data fetching function
  const fetchData = useCallback(async () => {
    if (hasLoadedRef.current) return; // Prevent multiple calls
    
    try {
      setLoading(true);
      setError(null);
      hasLoadedRef.current = true;
      
      console.log('Fetching admin stats...');
      
      // Fetch summary stats
      const statsResponse = await axiosSecure.get('/admin-stats');
      console.log('Stats response:', statsResponse.data);
      setData(statsResponse.data || {});
      
      // Fetch all payments for revenue and charts
      const paymentsResponse = await axiosFetch.get('/allpayments');
      console.log('Payments response:', paymentsResponse.data);
      setPayments(Array.isArray(paymentsResponse.data) ? paymentsResponse.data : []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to fetch data');
      hasLoadedRef.current = false; // Allow retry on error
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, axiosFetch]);

  // Fetch data only once when component mounts
  useEffect(() => {
    fetchData();
  }, []); // Remove axiosSecure and axiosFetch from dependencies

  // Memoized calculations to prevent unnecessary re-renders
  const calculations = React.useMemo(() => {
    console.log('Calculating stats with payments:', payments);
    
    // Prepare monthly revenue data
    const monthData = payments
      .filter(p => p.enrolleddate && p.price) // Filter out invalid entries
      .reduce((acc, p) => {
        const month = moment(p.enrolleddate).format('MMM YYYY');
        const existing = acc.find(item => item.name === month);
        if (existing) {
          existing.value += Number(p.price) || 0;
        } else {
          acc.push({ name: month, value: Number(p.price) || 0 });
        }
        return acc;
      }, [])
      .sort((a, b) => moment(a.name, 'MMM YYYY') - moment(b.name, 'MMM YYYY'));

    // Prepare user revenue data
    const userData = payments
      .filter(p => p.userEmail && p.price) // Filter out invalid entries
      .reduce((acc, p) => {
        const user = p.userEmail;
        const existing = acc.find(item => item.name === user);
        if (existing) {
          existing.value += Number(p.price) || 0;
        } else {
          acc.push({ name: user, value: Number(p.price) || 0 });
        }
        return acc;
      }, []);

    // Calculate totals
    const totalMembers = users ? users.length : 0;
    const totalPayments = payments.length;
    const totalCourses = new Set(
      payments.flatMap(p => Array.isArray(p.PackagesNames) ? p.PackagesNames : [])
    ).size;
    const totalRevenue = data.totalRevenue || 
      payments.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

    return {
      monthData,
      userData,
      totalMembers,
      totalPayments,
      totalCourses,
      totalRevenue
    };
  }, [payments, users, data]);

  // Retry function
  const handleRetry = () => {
    hasLoadedRef.current = false;
    setError(null);
    fetchData();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <button 
            onClick={handleRetry}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    if (!statsRef.current) {
      alert('Stats container not found');
      return;
    }

    setIsDownloading(true);

    try {
      // Wait for libraries to load
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds timeout
      
      while ((!window.html2canvas || !window.jsPDF) && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!window.html2canvas || !window.jsPDF) {
        throw new Error('Required libraries not loaded. Please try again.');
      }

      // Generate canvas from HTML
      const canvas = await window.html2canvas(statsRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: statsRef.current.scrollWidth,
        height: statsRef.current.scrollHeight
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jsPDF;
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`admin-stats-report-${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Error generating PDF: ${error.message}. You can use browser print (Ctrl+P) as an alternative.`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    const printContent = statsRef.current.cloneNode(true);
    
    // Remove interactive elements for print
    const buttons = printContent.querySelectorAll('button');
    buttons.forEach(button => button.remove());
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admin Stats Report - ${new Date().toLocaleDateString()}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none !important; }
            * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
          }
          body { 
            font-family: system-ui, -apple-system, sans-serif; 
            background: white;
          }
          .motion-div { 
            animation: none !important; 
            transform: none !important; 
          }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #1f2937; font-size: 24px; font-weight: bold;">Admin Dashboard Report</h1>
          <p style="color: #6b7280;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        ${printContent.outerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          }
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <Slide>
      <div className="min-h-screen bg-gray-50 p-4">
        <motion.div
          ref={statsRef}
          className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          {/* Debug Info */}
          <div className="mb-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
            <p>Debug: Users: {calculations.totalMembers}, Payments: {calculations.totalPayments}, Revenue: ৳{calculations.totalRevenue}</p>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Overview of platform statistics and analytics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Members */}
            <motion.div 
              className="flex items-center p-4 bg-green-500 rounded-lg text-white" 
              whileHover={{ scale: 1.05 }}
            >
              <FaUsers className="w-10 h-10 mr-4" />
              <div>
                <h3 className="text-sm uppercase font-semibold">Total Members</h3>
                <p className="text-3xl font-bold">{calculations.totalMembers}</p>
              </div>
            </motion.div>

            {/* Total Payments */}
            <motion.div 
              className="flex items-center p-4 bg-purple-500 rounded-lg text-white" 
              whileHover={{ scale: 1.05 }}
            >
              <FaRegListAlt className="w-10 h-10 mr-4" />
              <div>
                <h3 className="text-sm uppercase font-semibold">Total Payments</h3>
                <p className="text-3xl font-bold">{calculations.totalPayments}</p>
              </div>
            </motion.div>

            {/* Courses Sold */}
            <motion.div 
              className="flex items-center p-4 bg-yellow-500 rounded-lg text-white" 
              whileHover={{ scale: 1.05 }}
            >
              <FaChartPie className="w-10 h-10 mr-4" />
              <div>
                <h3 className="text-sm uppercase font-semibold">Courses Sold</h3>
                <p className="text-3xl font-bold">{calculations.totalCourses}</p>
              </div>
            </motion.div>

            {/* Total Revenue */}
            <motion.div 
              className="flex items-center p-4 bg-red-500 rounded-lg text-white" 
              whileHover={{ scale: 1.05 }}
            >
              <FaMoneyBillWave className="w-10 h-10 mr-4" />
              <div>
                <h3 className="text-sm uppercase font-semibold">Total Revenue</h3>
                <p className="text-3xl font-bold">{calculations.totalRevenue} ৳</p>
              </div>
            </motion.div>
          </div>

          {/* Charts Section */}
          {payments.length > 0 && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Monthly Sales Pie Chart */}
                {calculations.monthData.length > 0 && (
                  <div className="p-6 bg-white rounded-lg shadow border">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FaChartPie className="text-blue-500" /> Monthly Sales Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie 
                          data={calculations.monthData} 
                          dataKey="value" 
                          nameKey="name" 
                          outerRadius={80} 
                          label={({name, value}) => `${name}: ৳${value}`}
                        >
                          {calculations.monthData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`৳${value}`, 'Revenue']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Monthly Sales Bar Chart */}
                {calculations.monthData.length > 0 && (
                  <div className="p-6 bg-white rounded-lg shadow border">
                    <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={calculations.monthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`৳${value}`, 'Revenue']} />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* User Revenue Charts */}
              {calculations.userData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue by User Pie Chart */}
                  <div className="p-6 bg-white rounded-lg shadow border">
                    <h3 className="text-lg font-semibold mb-4">Revenue by User</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie 
                          data={calculations.userData} 
                          dataKey="value" 
                          nameKey="name" 
                          outerRadius={80} 
                          label={({name, value}) => `${name}: ৳${value}`}
                        >
                          {calculations.userData.map((entry, idx) => (
                            <Cell key={`user-cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`৳${value}`, 'Revenue']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Revenue by User Bar Chart */}
                  <div className="p-6 bg-white rounded-lg shadow border">
                    <h3 className="text-lg font-semibold mb-4">User Revenue Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={calculations.userData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis />
                        <Tooltip formatter={(value) => [`৳${value}`, 'Revenue']} />
                        <Bar dataKey="value" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </>
          )}

          {/* No data message */}
          {payments.length === 0 && !loading && (
            <div className="text-center py-12">
              <FaChartPie className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Payment Data Available</h3>
              <p className="text-gray-500">Charts will appear once payment data is available.</p>
            </div>
          )}
        </motion.div>

        {/* Download and Print Buttons */}
        <div className="max-w-7xl mx-auto flex justify-end gap-4 mt-6">
          {/* Print Button */}
          <motion.button
            onClick={handlePrint}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-lg font-semibold transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Report
          </motion.button>

      
          {/* <motion.button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            whileHover={{ scale: isDownloading ? 1 : 1.05 }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg font-semibold transition-all ${
              isDownloading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <FaDownload className={isDownloading ? 'animate-spin' : ''} />
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </motion.button> */}
        </div>

        {/* CDN Libraries Loading Status */}
        <div className="max-w-7xl mx-auto mt-4 text-center text-sm text-gray-500">
          {(!window.html2canvas || !window.jsPDF) && (
            <p>Powered By Apurba</p>
          )}
        </div>
      </div>
    </Slide>
  );
}