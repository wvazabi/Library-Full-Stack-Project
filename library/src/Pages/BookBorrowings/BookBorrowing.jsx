import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

function BookBorrowing() {
    const [bookBorrowings, setBookBorrowings] = useState([]);
    const [books, setBooks] = useState([]);
    const [update, setUpdate] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const searchByBookRef = useRef(null);
    const searchByDateStartRef = useRef(null);
    const searchByDateFinishRef = useRef(null);

    const [newBookBorrowing, setNewBookBorrowing] = useState({
        borrowerName: "",
        borrowerEmail: "",
        borrowingDate: "",
        returnDate: "",
        book: ""
    });

    const [updateBookBorrowing, setUpdateBookBorrowing] = useState({
        id: null,
        borrowerName: "",
        borrowerEmail: "",
        borrowingDate: "",
        returnDate: "",
        book: ""
    });

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_APP_BASEURL + "api/v1/book-borrowings")
            .then((res) => setBookBorrowings(res.data.content));

        axios
            .get(import.meta.env.VITE_APP_BASEURL + "api/v1/books")
            .then((res) => setBooks(res.data.content))
            .then(() => setUpdate(false));
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
        const bookObj = books.find((book) => book.id == value);
        setNewBookBorrowing((prev) => ({
            ...prev,
            book: bookObj
        }));
    };

    const handleAddNewBookBorrowing = () => {
        axios
            .post(import.meta.env.VITE_APP_BASEURL + "api/v1/book-borrowings", newBookBorrowing)
            .then(() => setUpdate(true))
            .then(() => setNewBookBorrowing({
                borrowerName: "",
                borrowerEmail: "",
                borrowingDate: "",
                returnDate: "",
                book: ""
            }));
    };

    const handleUpdateInput = (id) => {
        setIsUpdating(true);
        setUpdateBookBorrowing(bookBorrowings.find((bb) => bb.id == id));
    };

    const handleUpdateBookBorrowingInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateBookBorrowing((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateBookBorrowingBtn = () => {
        const { id } = updateBookBorrowing;
        axios
            .put(import.meta.env.VITE_APP_BASEURL + `api/v1/book-borrowings/${id}`, updateBookBorrowing)
            .then(() => setUpdate(true))
            .then(() => setIsUpdating(false))
            .then(() => setUpdateBookBorrowing({
                id: null,
                borrowerName: "",
                borrowerEmail: "",
                borrowingDate: "",
                returnDate: "",
                book: ""
            }));
    };

    const handleDeleteInput = (id) => {
        axios
            .delete(import.meta.env.VITE_APP_BASEURL + `api/v1/book-borrowings/${id}`)
            .then(() => setUpdate(true));
    };

    const handleSearchByBookAndDate = () => {
        const bookId = searchByBookRef.current.value;
        const startDate = searchByDateStartRef.current.value;
        const finishDate = searchByDateFinishRef.current.value;

        axios
            .get(import.meta.env.VITE_APP_BASEURL + `api/v1/book-borrowings/searchByBookAndDateRange?bookId=${bookId}&startDate=${startDate}&endDate=${finishDate}`)
            .then((res) => setBookBorrowings(res.data.content));
    };

    return (
        <>
            <div className='search-bar'>
                <div>
                    <h3>Search by Book and Date Range</h3>
                    <select ref={searchByBookRef}>
                        <option value="">Select Book</option>
                        {books.map((book) => (
                            <option key={book.id} value={book.id}>
                                {book.title}
                            </option>
                        ))}
                    </select>
                    <input 
                        type="date"
                        ref={searchByDateStartRef}
                    />
                    <input 
                        type="date"
                        ref={searchByDateFinishRef}
                    />
                    <button onClick={handleSearchByBookAndDate}>Search by Book and Date</button>
                </div>
            </div>

            <div className='add-and-update-bar'>
                <h2>Add New Book Borrowing</h2>
                <input 
                    type="text"
                    placeholder='Borrower Name'
                    name='borrowerName'
                    value={newBookBorrowing.borrowerName}
                    onChange={handleNewBookBorrowingInputChange}
                />
                <input 
                    type="email"
                    placeholder='Borrower Email'
                    name='borrowerEmail'
                    value={newBookBorrowing.borrowerEmail}
                    onChange={handleNewBookBorrowingInputChange}
                />
                <input 
                    type="datetime-local"
                    placeholder='Borrowing Date'
                    name='borrowingDate'
                    value={newBookBorrowing.borrowingDate}
                    onChange={handleNewBookBorrowingInputChange}
                />
                <input 
                    type="datetime-local"
                    placeholder='Return Date'
                    name='returnDate'
                    value={newBookBorrowing.returnDate}
                    onChange={handleNewBookBorrowingInputChange}
                />
                <select name="book" onChange={handleNewBookBorrowingBook}>
                    <option value="">Select Book</option>
                    {books.map((book) => (
                        <option key={book.id} value={book.id}>
                            {book.title}
                        </option>
                    ))}
                </select>
                <button onClick={handleAddNewBookBorrowing}>Add Book Borrowing</button>

                {isUpdating &&
                <div>
                    <h2>Update Book Borrowing</h2>
                    <input 
                        type="text"
                        placeholder='Borrower Name'
                        name='borrowerName'
                        value={updateBookBorrowing.borrowerName}
                        onChange={handleUpdateBookBorrowingInputChange}
                    />
                    <input 
                        type="email"
                        placeholder='Borrower Email'
                        name='borrowerEmail'
                        value={updateBookBorrowing.borrowerEmail}
                        onChange={handleUpdateBookBorrowingInputChange}
                    />
                    <input 
                        type="datetime-local"
                        placeholder='Borrowing Date'
                        name='borrowingDate'
                        value={updateBookBorrowing.borrowingDate}
                        onChange={handleUpdateBookBorrowingInputChange}
                    />
                    <input 
                        type="datetime-local"
                        placeholder='Return Date'
                        name='returnDate'
                        value={updateBookBorrowing.returnDate}
                        onChange={handleUpdateBookBorrowingInputChange}
                    />
                    <select name="book" onChange={handleUpdateBookBorrowingInputChange} value={updateBookBorrowing.book?.id || ""}>
                        <option value="">Select Book</option>
                        {books.map((book) => (
                            <option key={book.id} value={book.id}>
                                {book.title}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleUpdateBookBorrowingBtn}>Update Book Borrowing</button>
                </div>}
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Borrower Name</th>
                        <th>Borrower Email</th>
                        <th>Borrowing Date</th>
                        <th>Return Date</th>
                        <th>Book Title</th>
                    </tr>
                </thead>
                <tbody>
                    {bookBorrowings.map((bookBorrowing) => (
                        <tr key={bookBorrowing.id}>
                            <td>{bookBorrowing.borrowerName}</td>
                            <td>{bookBorrowing.borrowerEmail}</td>
                            <td>{new Date(bookBorrowing.borrowingDate).toLocaleString()}</td>
                            <td>{new Date(bookBorrowing.returnDate).toLocaleString()}</td>
                            <td>{bookBorrowing.book?.title}</td>
                            <td>
                                <button onClick={() => handleDeleteInput(bookBorrowing.id)}>DELETE</button>
                                <button onClick={() => handleUpdateInput(bookBorrowing.id)}>UPDATE</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default BookBorrowing;
