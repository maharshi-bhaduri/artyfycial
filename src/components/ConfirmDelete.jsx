import React from 'react';
import Loader from './Loader';

const ConfirmDelete = ({ onConfirm, onCancel, isLoading }) => {
    return (
        <div>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <p>Are you sure you want to delete this artwork?</p>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={onConfirm}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mr-2"
                        >
                            Yes
                        </button>
                        <button
                            onClick={onCancel}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                        >
                            No
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ConfirmDelete;
