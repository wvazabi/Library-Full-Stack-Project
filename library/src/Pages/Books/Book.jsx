import axios from 'axios';
import { useState, useEffect } from 'react';
import './book.css';

function Book() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [update, setUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newBook, setNewBook] = useState({
    name: "",
    publicationYear: "",
    stock: "",
    author: "",
    publisher: "",
    categories: []
  });
  const [updateBook, setUpdateBook] = useState({
    name: "",
    publicationYear: "",
    stock: "",
    author: "",
    publisher: "",
    categories: []
  });

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_BASEURL + "api/v1/books")
      .then((res) => setBooks(res.data.content));

    axios
      .get(import.meta.env.VITE_APP_BASEURL + "api/v1/authors")
      .then((res) => setAuthors(res.data.content));

    axios
      .get(import.meta.env.VITE_APP_BASEURL + "api/v1/publishers")
      .then((res) => setPublishers(res.data.content));

    axios
      .get(import.meta.env.VITE_APP_BASEURL + "api/v1/categories")
      .then((res) => setCategories(res.data.content))
      .then(() => setUpdate(false));
  }, [update]);

  const handleNewBookInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNewBook = () => {
    axios
      .post(import.meta.env.VITE_APP_BASEURL + "api/v1/books", newBook)
      .then(() => setUpdate(true))
      .then(() => setNewBook({
        name: "",
        publicationYear: "",
        stock: "",
        author: "",
        publisher: "",
        categories: []
      }));
  };

  const handleDeleteInput = (e) => {
    const { id } = e.target;
    axios
      .delete(import.meta.env.VITE_APP_BASEURL + `api/v1/books/${id}`)
      .then(() => setUpdate(true));
  };

  const handleUpdateInput = (e) => {
    const { id } = e.target;
    setIsUpdating(true);
    setUpdateBook(books.find((book) => book.id === +id));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name === "author" || name === "publisher") {
      setNewBook({
        ...newBook,
        [name]: value
      });
    }
  };

  const handleUpdateBookInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateBook((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateBookBtn = () => {
    const { id } = updateBook;
    axios
      .put(import.meta.env.VITE_APP_BASEURL + `api/v1/books/${id}`, updateBook)
      .then(() => setUpdate(true))
      .then(() => setUpdateBook({
        name: "",
        publicationYear: "",
        stock: "",
        author: "",
        publisher: "",
        categories: []
      }))
      .then(() => setIsUpdating(false));
  };

  const handleSearchBookByName = (value) => {
    if (value === '') {
      setUpdate(true);
    } else {
      const searchedBook = books.filter((book) => book.name.toLowerCase().includes(value.toLowerCase()));
      setBooks(searchedBook);
    }
  };

  return (
    <>
      <div className='search-bar'>
        <div>
          <h3>Search Book By Name</h3>
          <input
            type="text"
            placeholder='Book Name'
            onChange={(e) => handleSearchBookByName(e.target.value)}
          />
        </div>
      </div>
      <div className='add-and-update-bar'>
        <h2>Add New Book</h2>
        <input
          type="text"
          placeholder='Name'
          name="name"
          value={newBook.name}
          onChange={handleNewBookInputChange}
        />
        <input
          type="number"
          placeholder='Publication Year'
          name="publicationYear"
          value={newBook.publicationYear}
          onChange={handleNewBookInputChange}
        />
        <input
          type="number"
          placeholder='Stock'
          name="stock"
          value={newBook.stock}
          onChange={handleNewBookInputChange}
        />
        <select name="author" onChange={handleSelectChange}>
          <option value="">Select Author</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
        <select name="publisher" onChange={handleSelectChange}>
          <option value="">Select Publisher</option>
          {publishers.map((publisher) => (
            <option key={publisher.id} value={publisher.id}>
              {publisher.name}
            </option>
          ))}
        </select>
        <select multiple name="categories" onChange={handleSelectChange}>
          <option value="">Select Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddNewBook}>Add Book</button>

        {isUpdating &&
          <div>
            <h2>Update Book</h2>
            <input
              type="text"
              placeholder='Name'
              name="name"
              value={updateBook.name}
              onChange={handleUpdateBookInputChange}
            />
            <input
              type="number"
              placeholder='Publication Year'
              name="publicationYear"
              value={updateBook.publicationYear}
              onChange={handleUpdateBookInputChange}
            />
            <input
              type="number"
              placeholder='Stock'
              name="stock"
              value={updateBook.stock}
              onChange={handleUpdateBookInputChange}
            />
            <select name="author" value={updateBook.author?.id} disabled>
              <option value={updateBook.author?.id}>{updateBook.author?.name}</option>
            </select>
            <select name="publisher" value={updateBook.publisher?.id} disabled>
              <option value={updateBook.publisher?.id}>{updateBook.publisher?.name}</option>
            </select>
            <select multiple name="categories" value={updateBook.categories.map(c => c.id)} disabled>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button onClick={handleUpdateBookBtn}>Update Book</button>
          </div>
        }
      </div>

      <table>
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Publication Year</th>
            <th>Stock</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>Categories</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.name}</td>
              <td>{book.publicationYear}</td>
              <td>{book.stock}</td>
              <td>{book.author.name}</td>
              <td>{book.publisher.name}</td>
              <td>{book.categories.map(category => category.name).join(', ')}</td>
              <td>
                <button id={book.id} onClick={handleDeleteInput}>DELETE</button>
                <button id={book.id} onClick={handleUpdateInput}>UPDATE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Book;
