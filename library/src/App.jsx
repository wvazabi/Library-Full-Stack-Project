import './App.css';
import { Routes, Route } from "react-router-dom";
import Author from './Pages/Authors/Author';
import Book from './Pages/Books/Book';
import Navbar from './components/Navbar';
import BookBorrowing from './Pages/BookBorrowings/BookBorrowing';
import Publisher from './Pages/Publishers/Publisher';
import Category from './Pages/Categories/Category';
import HomePage from './Pages/HomePage/HomePage';
import {useState} from 'react';


function App() {

  const [homePage, setHomePage] = useState(true);

  return (
    <>
      
        <Navbar></Navbar>
        <div className='container'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<Book />} />
          <Route path="/book-borrowing" element={<BookBorrowing />} />
          <Route path="/publisher" element={<Publisher />} />
          <Route path="/author" element={<Author />} />
          <Route path="/category" element={<Category />} />
        </Routes>
      </div>

    </>
  );
}

export default App
