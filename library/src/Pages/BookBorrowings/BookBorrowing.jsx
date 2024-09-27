import axios from 'axios';
import { useState, useEffect } from 'react';
import ErrorModal from './ErrorModal/ErrorModal.jsx'; // Import the modal for error handling

function BookBorrowing() {
    // State to hold book borrowings, books, update trigger, updating status, and error messages
    const [bookBorrowings, setBookBorrowings] = useState([]);
    const [books, setBooks] = useState([]);
    const [update, setUpdate] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null); // Error state for managing error messages

    // State to manage new book borrowing inputs
    const [newBookBorrowing, setNewBookBorrowing] = useState({
        borrowerName: "",
        borrowerMail: "",
        borrowingDate: "",
        returnDate: "",
        book: null
    });

    // State to manage inputs for updating a book borrowing
    const [updateBookBorrowing, setUpdateBookBorrowing] = useState({
        id: null,
        borrowerName: "",
        borrowerMail: "",
        borrowingDate: "",
        returnDate: "",
        book: null
    });

    // Fetch book borrowings and available books on component mount and when 'update' changes
    useEffect(() => {
        // Fetch book borrowings
        axios
            .get(import.meta.env.VITE_APP_BASEURL + "api/v1/borrows")
            .then((res) => setBookBorrowings(res.data))
            .catch((error) => handleError("Error fetching book borrowings:", error));

        // Fetch available books
        axios
            .get(import.meta.env.VITE_APP_BASEURL + "api/v1/books")
            .then((res) => setBooks(res.data))
            .catch((error) => handleError("Error fetching books:", error));

        // Reset update state after fetching
        setUpdate(false);
    }, [update]);

    // Handle input changes for new book borrowing
    const handleNewBookBorrowingInputChange = (e) => {
        const { name, value } = e.target;
        setNewBookBorrowing((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle book selection for new borrowing
    const handleNewBookBorrowingBook = (e) => {
        const { value } = e.target;
        const bookObj = books.find((book) => book.id === parseInt(value, 10));
        setNewBookBorrowing((prev) => ({
            ...prev,
            book: bookObj
        }));
    };

    // Validate input fields for adding new book borrowing
    const validateFields = () => {
        const { borrowerName, borrowerMail, borrowingDate, book } = newBookBorrowing;
        
        if (!borrowerName || !borrowerMail || !borrowingDate || !book) {
            return false; // All fields except return date must be filled
        }
        return true; // All required fields are valid
    };

    // Validate dates for borrowing and returning books
    const validateDates = (borrowingDate, returnDate) => {
        const today = new Date();
        const borrowing = new Date(borrowingDate);
    
        // Check if borrowing date is in the future
        if (borrowing > today) {
            return "Borrowing date cannot be in the future.";
        }
    
        // Check if return date is before borrowing date
        if (returnDate && new Date(returnDate) < borrowing) {
            return "Return date cannot be before borrowing date.";
        }
    
        return null; // Dates are valid
    };

    // Handle adding a new book borrowing
    const handleAddNewBookBorrowing = () => {
        // Validate fields before proceeding
        if (!validateFields()) {
            setError("All fields except return date are required");
            return;
        }

        // Validate dates
        const dateError = validateDates(newBookBorrowing.borrowingDate, newBookBorrowing.returnDate);
        if (dateError) {
            setError(dateError);
            return; // Return if date validation fails
        }
    
        const selectedBook = newBookBorrowing.book;

        // Check if the selected book's stock is 0
        if (selectedBook && selectedBook.stock <= 0) {
            setError("Selected book is out of stock.");
            return; // Prevent borrowing if stock is zero
        }
    
        // Format book details for API request
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
            returnDate: newBookBorrowing.returnDate || null, // Assign null if returnDate is empty
            bookForBorrowingRequest: formattedBook
        };
    
        // Make API request to add new borrowing
        axios.post(import.meta.env.VITE_APP_BASEURL + "api/v1/borrows", payload)
            .then(() => {
                setUpdate(true); // Trigger re-fetching data
                // Reset form fields
                setNewBookBorrowing({
                    borrowerName: "",
                    borrowerMail: "",
                    borrowingDate: "",
                    returnDate: "",
                    book: null
                });
            })
            .catch((error) => {
                setError("Error adding book borrowing: " + error.message); // Handle error
            });
    };

    // Prepare for updating a book borrowing
    const handleUpdateInput = (id) => {
        setIsUpdating(true);
        setUpdateBookBorrowing(bookBorrowings.find((bb) => bb.id === id));
    };

    // Handle input changes for updating book borrowing
    const handleUpdateBookBorrowingInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateBookBorrowing((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle book selection for updating borrowing
    const handleUpdateBookBorrowingBook = (e) => {
        const { value } = e.target;
        const bookObj = books.find((book) => book.id === parseInt(value, 10));
        setUpdateBookBorrowing((prev) => ({
            ...prev,
            book: bookObj
        }));
    };

    // Handle updating a book borrowing
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
            return; // Return if date validation fails
        }
    
        const payload = {
            borrowerName: updateBookBorrowing.borrowerName,
            borrowerMail: updateBookBorrowing.borrowerMail,
            borrowingDate: updateBookBorrowing.borrowingDate,
            returnDate: updateBookBorrowing.returnDate, // Return date can be left empty
            bookForBorrowingRequest: formattedBook
        };
    
        // Make API request to update borrowing
        axios
            .put(import.meta.env.VITE_APP_BASEURL + `api/v1/borrows/${updateBookBorrowing.id}`, payload)
            .then(() => {
                setUpdate(true); // Trigger re-fetching data
                setIsUpdating(false); // Reset updating state
                // Reset update fields
                setUpdateBookBorrowing({
                    id: null,
                    borrowerName: "",
                    borrowerMail: "",
                    borrowingDate: "",
                    returnDate: "", 
                    book: null
                });
            })
            .catch((error) => handleError("Error updating book borrowing:", error)); // Handle error
    };

    // Handle deleting a book borrowing
    const handleDeleteInput = (id) => {
        axios
            .delete(import.meta.env.VITE_APP_BASEURL + `api/v1/borrows/${id}`)
            .then(() => setUpdate(true)) // Trigger re-fetching data
            .catch((error) => handleError("Error deleting book borrowing:", error)); // Handle error
    };

    // Centralized error handling function
    const handleError = (message, error) => {
        console.error(message, error); // Log error to console
        setError(`${message} ${error.message}`); // Set error state
    };

    // Get book title by ID for display
    const getBookTitleById = (id) => {
        const book = books.find((b) => b.id === id);
        return book ? book.name : "Unknown"; // Return book name or "Unknown"
    };

    return (
        <>
            {error && <ErrorModal message={error} onClose={() => setError(null)} />} {/* Display error modal if error exists */}
            <div className='add-and-update-bar'>
                <h3>Add Book Borrowing</h3>
                <div className='form-row'>
                    <input
                        type="text"
                        name="borrowerName"
                        placeholder="Borrower Name"
                        value={newBookBorrowing.borrowerName}
                        onChange={handleNewBookBorrowingInputChange}
                    />
                    <input
                        type="email"
                        name="borrowerMail"
                        placeholder="Borrower Email"
                        value={newBookBorrowing.borrowerMail}
                        onChange={handleNewBookBorrowingInputChange}
                    />
                    <input
                        type="date"
                        name="borrowingDate"
                        placeholder="Borrowing Date"
                        value={newBookBorrowing.borrowingDate}
                        onChange={handleNewBookBorrowingInputChange}
                    />
                    <input
                        type="date"
                        name="returnDate"
                        placeholder="Return Date"
                        value={newBookBorrowing.returnDate}
                        onChange={handleNewBookBorrowingInputChange}
                    />
                    <select onChange={handleNewBookBorrowingBook} value={newBookBorrowing.book?.id || ''}>
                        <option value="" disabled>Select a book</option>
                        {books.map((book) => (
                            <option key={book.id} value={book.id}>{book.name}</option>
                        ))}
                    </select>
                </div>
                <button onClick={handleAddNewBookBorrowing}>Add Book Borrowing</button>
            </div>

            <div className='borrowed-books'>
                <h3>Book Borrowings</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Borrower Name</th>
                            <th>Borrower Email</th>
                            <th>Borrowing Date</th>
                            <th>Return Date</th>
                            <th>Book</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookBorrowings.map((bb) => (
                            <tr key={bb.id}>
                                <td>{bb.borrowerName}</td>
                                <td>{bb.borrowerMail}</td>
                                <td>{new Date(bb.borrowingDate).toLocaleDateString()}</td>
                                <td>{bb.returnDate ? new Date(bb.returnDate).toLocaleDateString() : "Not Returned"}</td>
                                <td>{getBookTitleById(bb.book.id)}</td>
                                <td>
                                    <button onClick={() => handleUpdateInput(bb.id)}>Update</button>
                                    <button onClick={() => handleDeleteInput(bb.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isUpdating && (
                <div className='update-bar'>
                    <h3>Update Book Borrowing</h3>
                    <div className='form-row'>
                        <input
                            type="text"
                            name="borrowerName"
                            placeholder="Borrower Name"
                            value={updateBookBorrowing.borrowerName}
                            onChange={handleUpdateBookBorrowingInputChange}
                        />
                        <input
                            type="email"
                            name="borrowerMail"
                            placeholder="Borrower Email"
                            value={updateBookBorrowing.borrowerMail}
                            onChange={handleUpdateBookBorrowingInputChange}
                        />
                        <input
                            type="date"
                            name="borrowingDate"
                            placeholder="Borrowing Date"
                            value={updateBookBorrowing.borrowingDate}
                            onChange={handleUpdateBookBorrowingInputChange}
                        />
                        <input
                            type="date"
                            name="returnDate"
                            placeholder="Return Date"
                            value={updateBookBorrowing.returnDate}
                            onChange={handleUpdateBookBorrowingInputChange}
                        />
                        <select onChange={handleUpdateBookBorrowingBook} value={updateBookBorrowing.book?.id || ''}>
                            <option value="" disabled>Select a book</option>
                            {books.map((book) => (
                                <option key={book.id} value={book.id}>{book.name}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleUpdateBookBorrowingBtn}>Update Book Borrowing</button>
                </div>
            )}
        </>
    );
}

export default BookBorrowing;
