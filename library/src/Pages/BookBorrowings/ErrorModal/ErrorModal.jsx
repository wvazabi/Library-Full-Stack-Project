// src/Pages/BookBorrowings/ErrorModal/ErrorModal.jsx
import React from 'react';
import './ErrorModal.css'; // Ensure this CSS file exists if used

const ErrorModal = ({ message, onClose }) => (
    <div className='error-modal'>
        <div className='error-modal-content'>
            <span className='close' onClick={onClose}>&times;</span>
            <p>{message}</p>
        </div>
    </div>
);

export default ErrorModal;
