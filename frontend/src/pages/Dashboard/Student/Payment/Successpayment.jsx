import React from 'react';

const Successpayment = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-50">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                <div className="text-green-500 mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-16 h-16 mx-auto"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4M6 12.5l1.5 1.5m3-7.5a9 9 0 11-9 9"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-700">
                    Payment Successful!
                </h1>
                <p className="text-gray-500 mt-2">
                    Thank you for your payment. Your transaction was completed successfully.
                </p>
               
            </div>

            <div className="mt-8 text-center">
                <p className="text-gray-400">
                    Need help? <a href="/support" className="text-blue-500 underline">Contact Support</a>
                </p>
            </div>
        </div>
    );
};

export default Successpayment;
