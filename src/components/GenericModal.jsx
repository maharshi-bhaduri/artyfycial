import React from 'react';
import ReactModal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        padding: '5px',
        transform: 'translate(-50%, -50%)',
        maxHeight: '80vh',
        overflow: 'hidden',
        transition: 'transform 0.3s ease-out',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        transition: 'opacity 0.3s ease-out',
    },
};

const GenericModal = ({ isOpen, onRequestClose, title, children, minHeight, width }) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            style={customStyles}
        >
            <div className="bg-white w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-2 border-b">
                    <h2 className="mx-2 text-xl font-bold">{title}</h2>
                    <button
                        onClick={onRequestClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                        Close
                    </button>
                </div>
                <div style={{ minHeight, width }}>
                    <div className="overflow-y-auto max-h-[calc(80vh-70px)] p-4">
                        {children}
                    </div>
                </div>
            </div>
        </ReactModal>
    );
};

export default GenericModal;
