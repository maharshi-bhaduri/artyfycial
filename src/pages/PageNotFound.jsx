import React from 'react';

const PageNotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="bg-gray-100 p-8 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-center text-gray-800">Oops! Page Not Found</h1>
                <p className="text-center text-gray-600 mt-4">The page you are looking for does not exist.</p>
            </div>
        </div>
    );
};

export default PageNotFound;
