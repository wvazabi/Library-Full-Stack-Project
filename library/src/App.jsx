import './App.css';
import { Routes, Route } from "react-router-dom"; // Importing routing components
import Author from './Pages/Authors/Author'; // Importing Author page
import Book from './Pages/Books/Book'; // Importing Book page
import Navbar from './components/Navbar'; // Importing Navbar component
import BookBorrowing from './Pages/BookBorrowings/BookBorrowing'; // Importing Book Borrowing page
import Publisher from './Pages/Publishers/Publisher'; // Importing Publisher page
import Category from './Pages/Categories/Category'; // Importing Category page
import HomePage from './Pages/HomePage/HomePage'; // Importing Home Page
import { useState } from 'react'; // Importing useState hook from React

function App() {
  // State to track if we are on the home page
  const [homePage, setHomePage] = useState(true);

  return (
    <>
      <Navbar /> {/* Rendering the Navbar component */}
      <div className='container'> {/* Container for the main content */}
        <Routes> {/* Setting up routes for different pages */}
          <Route path="/" element={<HomePage />} /> {/* Home page route */}
          <Route path="/book" element={<Book />} /> {/* Book page route */}
          <Route path="/book-borrowing" element={<BookBorrowing />} /> {/* Book Borrowing page route */}
          <Route path="/publisher" element={<Publisher />} /> {/* Publisher page route */}
          <Route path="/author" element={<Author />} /> {/* Author page route */}
          <Route path="/category" element={<Category />} /> {/* Category page route */}
        </Routes>
      </div>
    </>
  );
}

export default App; // Exporting the App component
