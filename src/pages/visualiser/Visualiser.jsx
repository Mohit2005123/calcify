import React from 'react';
import { Link } from 'react-router-dom';

const Visualiser = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Navigate to Different Pages</h1>
      <div className="space-y-4">
        <Link to="/visualiser/sorting">
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition duration-300 ease-in-out">
            Go to Page 1
          </button>
        </Link>
        <Link to="/page2">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out">
            Go to Page 2
          </button>
        </Link>
        <Link to="/page3">
          <button className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-600 transition duration-300 ease-in-out">
            Go to Page 3
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Visualiser;
