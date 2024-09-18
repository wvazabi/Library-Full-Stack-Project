import axios from 'axios';
import { useState, useEffect } from 'react';
import ErrorModal from './ErrorModal/ErrorModal.jsx'; // Import the modal

function BookBorrowing() {
    const [bookBorrowings, setBookBorrowings] = useState([]);
    const [books, setBooks] = useState([]);
    const [update, setUpdate] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null); // Error state

    const [newBookBorrowing, setNewBookBorrowing] = useState({
        borrowerName: "",
        borrowerMail: "",
        borrowingDate: "",
        returnDate: "",
        book: null
    });

    const [updateBookBorrowing, setUpdateBookBorrowing] = useState({
        id: null,
        borrowerName: "",
        borrowerMail: "",
        borrowingDate: "",
        returnDate: "",
        book: null
    });

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_APP_BASEURL + "api/v1/borrows")
            .then((res) => setBookBorrowings(res.data))
            .catch((error) => handleError("Error fetching book borrowings:", error));

        axios
            .get(import.meta.env.VITE_APP_BASEURL + "api/v1/books")
            .then((res) => setBooks(res.data))
            .catch((error) => handleError("Error fetching books:", error));

        setUpdate(false);
    }, [update]);

    const handleNewBookBorrowingInputChange = (e) => {
        const { name, value } = e.target;
        setNewBookBorrowing((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNewBookBorrowingBook = (e) => {
        const { value } = e.target;
        const bookObj = books.find((book) => book.id === parseInt(value, 10));
        setNewBookBorrowing((prev) => ({
            ...prev,
            book: bookObj
        }));
    };

    const validateFields = () => {
        const { borrowerName, borrowerMail, borrowingDate, returnDate, book } = newBookBorrowing;
        
        if (!borrowerName || !borrowerMail || !borrowingDate || !returnDate || !book) {
            return false;
        }
        return true;
    };

    const validateDates = (borrowingDate, returnDate) => {
        const today = new Date();
        const borrowing = new Date(borrowingDate);
        const returnD = returnDate ? new Date(returnDate) : today;
    
        if (borrowing > today) {
            return "Borrowing date cannot be in the future.";
        }
    
        if (returnD < borrowing) {
            return "Return date cannot be before borrowing date.";
        }
    
        return null;
    };
    
    
    const handleAddNewBookBorrowing = () => {
        if (!validateFields()) {
            setError("All fields are required");
            return;
        }
    
        // Adjusted to handle null or empty returnDate by using today's date
        const finalReturnDate = newBookBorrowing.returnDate || new Date().toISOString().split('T')[0];
    
        const dateError = validateDates(newBookBorrowing.borrowingDate, finalReturnDate);
        if (dateError) {
            setError(dateError);
            return;
        }
    
        const selectedBook = newBookBorrowing.book;
    
        // Check if the selected book's stock is 0
        if (selectedBook && selectedBook.stock <= 0) {
            setError("Selected book is out of stock.");
            return;
        }
    
        const formattedBook = selectedBook ? {
            id: selectedBook.id,
            name: selectedBook.name,
            publicationYear: selectedBook.publicationYear,
            stock: selectedBook.stock
        } : null;
    
        const payload = {
            borrowerName: newBookBorrowing.borrowerName,
            borrowerMail: newBookBorrowing.borrowerMail,
            borrowingDate: newBookBorrowing.borrowingDate,
            returnDate: finalReturnDate, // Adjusted to handle null or empty returnDate
            bookForBorrowingRequest: formattedBook
        };
    
        console.log("Payload:", payload); // Debug için ekleyin
    
        axios.post(import.meta.env.VITE_APP_BASEURL + "api/v1/borrows", payload)
            .then(() => {
                setUpdate(true);
                setNewBookBorrowing({
                    borrowerName: "",
                    borrowerMail: "",
                    borrowingDate: "",
                    returnDate: "",
                    book: null
                });
            })
            .catch((error) => {
                setError("Error adding book borrowing: " + error.message);
            });
    };
    
    
    const handleUpdateInput = (id) => {
        setIsUpdating(true);
        setUpdateBookBorrowing(bookBorrowings.find((bb) => bb.id === id));
    };

    const handleUpdateBookBorrowingInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateBookBorrowing((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateBookBorrowingBook = (e) => {
        const { value } = e.target;
        const bookObj = books.find((book) => book.id === parseInt(value, 10));
        setUpdateBookBorrowing((prev) => ({
            ...prev,
            book: bookObj
        }));
    };

    const handleUpdateBookBorrowingBtn = () => {
        const formattedBook = updateBookBorrowing.book ? {
            id: updateBookBorrowing.book.id,
            name: updateBookBorrowing.book.name,
            publicationYear: updateBookBorrowing.book.publicationYear,
            stock: updateBookBorrowing.book.stock
        } : null;
    
        // Validate fields and dates
        const dateError = validateDates(updateBookBorrowing.borrowingDate, updateBookBorrowing.returnDate);
        if (dateError) {
            setError(dateError);
            return;
        }
    
        const payload = {
            borrowerName: updateBookBorrowing.borrowerName,
            borrowerMail: updateBookBorrowing.borrowerMail,
            borrowingDate: updateBookBorrowing.borrowingDate,
            returnDate: updateBookBorrowing.returnDate, // Return date'i boş bırakmayın
            bookForBorrowingRequest: formattedBook
        };
    
        axios
            .put(import.meta.env.VITE_APP_BASEURL + `api/v1/borrows/${updateBookBorrowing.id}`, payload)
            .then(() => {
                setUpdate(true);
                setIsUpdating(false);
                setUpdateBookBorrowing({
                    id: null,
                    borrowerName: "",
                    borrowerMail: "",
                    borrowingDate: "",
                    returnDate: "", // returnDate'i boş olarak sıfırla
                    book: null
                });
            })
            .catch((error) => handleError("Error updating book borrowing:", error));
    };

    const handleDeleteInput = (id) => {
        axios
            .delete(import.meta.env.VITE_APP_BASEURL + `api/v1/borrows/${id}`)
            .then(() => setUpdate(true))
            .catch((error) => handleError("Error deleting book borrowing:", error));
    };

    const handleError = (message, error) => {
        console.error(message, error);
        setError(`${message} ${error.message}`);
    };

    const getBookTitleById = (id) => {
        const book = books.find((b) => b.id === id);
        return book ? book.name : "Unknown";
    };

    return (
        <>
            {error && <ErrorModal message={error} onClose={() => setError(null)} />}
            <div className='add-and-update-bar'>
                <h3>Add Book Borrowing</h3>
                <div className='form-row'>
                    <input
                        type="text"
                        name="borrowerName"
                        placeholder="Borrower Name"
                        value={newBookBorrowing.borrowerName || ''} // Handle empty value
                        onChange={handleNewBookBorrowingInputChange}
                    />
                    <input
                        type="email"
                        name="borrowerMail"
                        placeholder="Borrower Email"
                        value={newBookBorrowing.borrowerMail || ''} // Handle empty value
                        onChange={handleNewBookBorrowingInputChange}
                    />
                    <input
                        type="date"
                        name="borrowingDate"
                        placeholder="Borrowing Date"
                        value={newBookBorrowing.borrowingDate || ''} // Handle empty value
                        onChange={handleNewBookBorrowingInputChange}
                    />
                    <input
                        type="date"
                        name="returnDate"
                        placeholder="Return Date"
                        value={newBookBorrowing.returnDate || ''} // Handle empty value
                        onChange={handleNewBookBorrowingInputChange}
                    />
                    <select
                        name="book"
                        value={newBookBorrowing.book ? newBookBorrowing.book.id : ''}
                        onChange={handleNewBookBorrowingBook}
                    >
                        <option value="">Select Book</option>
                        {books.map((book) => (
                            <option key={book.id} value={book.id}>
                                {book.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleAddNewBookBorrowing}>Add</button>
                </div>
                {isUpdating && (
                    <div className='form-row'>
                        <h3>Update Book Borrowing</h3>
                        <input
                            type="text"
                            name="borrowerName"
                            placeholder="Borrower Name"
                            value={updateBookBorrowing.borrowerName || ''} // Handle empty value
                            onChange={handleUpdateBookBorrowingInputChange}
                        />
                        <input
                            type="email"
                            name="borrowerMail"
                            placeholder="Borrower Email"
                            value={updateBookBorrowing.borrowerMail || ''} // Handle empty value
                            onChange={handleUpdateBookBorrowingInputChange}
                        />
                        <input
                            type="date"
                            name="borrowingDate"
                            placeholder="Borrowing Date"
                            value={updateBookBorrowing.borrowingDate || ''} // Handle empty value
                            onChange={handleUpdateBookBorrowingInputChange}
                        />
                        <input
                            type="date"
                            name="returnDate"
                            placeholder="Return Date"
                            value={updateBookBorrowing.returnDate || ''} // Handle empty value
                            onChange={handleUpdateBookBorrowingInputChange}
                        />
                        <select
                            name="book"
                            value={updateBookBorrowing.book ? updateBookBorrowing.book.id : ''}
                            onChange={handleUpdateBookBorrowingBook}
                        >
                            <option value="">Select Book</option>
                            {books.map((book) => (
                                <option key={book.id} value={book.id}>
                                    {book.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleUpdateBookBorrowingBtn}>Update</button>
                    </div>
                )}
            </div>
            <div>
                <h3>Book Borrowings</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Book</th>
                            <th>Borrower Name</th>
                            <th>Borrower Email</th>
                            <th>Borrowing Date</th>
                            <th>Return Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookBorrowings.map((bb) => (
                            <tr key={bb.id}>
                                <td>{getBookTitleById(bb.book.id)}</td>
                                <td>{bb.borrowerName}</td>
                                <td>{bb.borrowerMail}</td>
                                <td>{bb.borrowingDate}</td>
                                <td>{bb.returnDate}</td>
                                <td>
                                    <button onClick={() => handleUpdateInput(bb.id)}>Update</button>
                                    <button onClick={() => handleDeleteInput(bb.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default BookBorrowing;
