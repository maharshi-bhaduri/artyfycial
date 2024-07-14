import React, { useState } from 'react';
import ReactModal from 'react-modal';
import Loader from './Loader';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        transition: 'transform 0.3s ease-out',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        transition: 'opacity 0.3s ease-out',
    },
};

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = () => {
        setIsLoading(true);
        onConfirm();
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            ariaHideApp={false}
        >
            <div className="modal-content">
                {isLoading ? (
                    <>
                        <Loader />
                        Deleting artwork
                    </>
                ) : (
                    <>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this artwork?</p>
                        <div className="modal-actions">
                            <button onClick={handleConfirm} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Yes</button>
                            <button onClick={onRequestClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">No</button>
                        </div>
                    </>
                )}
            </div>
        </ReactModal>
    );
};

export default ConfirmationModal;
