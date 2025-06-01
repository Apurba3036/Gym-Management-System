import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import moment from "moment";
import { motion } from 'framer-motion';
import { FaRegListAlt, FaEnvelope, FaDollarSign, FaCalendarAlt, FaReceipt, FaClipboardCheck, FaChartPie } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#A28CFD'];

export default function PaymentDetails() {
  const [payment, setPayment] = useState({});
  const { id } = useParams();
  const contentRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:5000/singlepayment/${id}`)
      .then(res => res.json())
      .then(data => setPayment(data))
      .catch(console.error);
  }, [id]);

  const convertToPdf = async () => {
    try {
      const canvas = await html2canvas(contentRef.current, { scale: 3 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.height;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.height;
      }

      pdf.save('payment-details.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
    }
  };

  const {
    transactionid,
    userEmail,
    userName,
    price = 0,
    quantity = 0,
    PackagesNames = [],
    InstructorsNames = [],
    enrolleddate
  } = payment;

  const chartData = PackagesNames.map((name) => ({ name, value: price / PackagesNames.length }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-100 py-8"
    >
      <div className="container mx-auto px-4">
        {/* Only this wrapper is captured */}
        <div ref={contentRef}>
          {/* Header */}
          <motion.div
            className="bg-cover bg-center h-48 rounded-lg overflow-hidden relative mb-8"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540496905036-5937c10647cc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Zml0bmVzcyUyMGNlbnRlcnxlbnwwfHwwfHx8MA%3D%3D')` }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white">Payment Summary</h1>
            </div>
          </motion.div>

          {/* Details Card */}
          <motion.div
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-orange-500 mb-6 flex items-center gap-2">
                <FaCalendarAlt /> Details
              </h2>
              {[
                { label: 'Transaction ID', icon: <FaRegListAlt className="text-blue-500" />, value: transactionid },
                { label: 'User Email', icon: <FaEnvelope className="text-red-500" />, value: userEmail },
                { label: 'User Name', icon: <FaClipboardCheck className="text-purple-500" />, value: userName },
                { label: 'Total Price', icon: <FaDollarSign className="text-green-500" />, value: `${price} ৳` },
                { label: 'Quantity', icon: <FaClipboardCheck className="text-purple-500" />, value: quantity },
                { label: 'Packages', icon: <FaReceipt className="text-yellow-500" />, value: PackagesNames.join(', ') },
                { label: 'Instructors', icon: <FaReceipt className="text-yellow-500" />, value: InstructorsNames.join(', ') },
                { label: 'Enrolled On', icon: <FaCalendarAlt className="text-blue-500" />, value: moment(enrolleddate).format('MMMM Do YYYY, h:mm a') }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center justify-between border-b py-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-gray-800">{item.value || 'N/A'}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-indigo-500 mb-4 flex items-center gap-2">
                  <FaChartPie /> Price Distribution
                </h2>
                <div className="w-full h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={chartData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Download Button (excluded from ref) */}
        <motion.button
          onClick={convertToPdf}
          whileHover={{ scale: 1.05 }}
          className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg mx-auto block hover:bg-blue-600 transition"
        >
          Download as PDF
        </motion.button>
      </div>
    </motion.div>
  );
}
