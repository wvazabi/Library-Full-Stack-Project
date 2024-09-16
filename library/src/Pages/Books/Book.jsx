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
  const [loading, setLoading] = useState(true);
  const [newBook, setNewBook] = useState({
    name: "",
    publicationYear: "",
    stock: "",
    author: null,
    publisher: null,
    categories: []
  });
  const [updateBook, setUpdateBook] = useState({
    id: null,
    name: "",
    publicationYear: "",
    stock: "",
    author: null,
    publisher: null,
    categories: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const booksRes = await axios.get(import.meta.env.VITE_APP_BASEURL + "api/v1/books");
        const authorsRes = await axios.get(import.meta.env.VITE_APP_BASEURL + "api/v1/authors");
        const publishersRes = await axios.get(import.meta.env.VITE_APP_BASEURL + "api/v1/publishers");
        const categoriesRes = await axios.get(import.meta.env.VITE_APP_BASEURL + "api/v1/categories");
        
        setBooks(booksRes.data);
        setAuthors(authorsRes.data);
        setPublishers(publishersRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [update]);

  const handleNewBookInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e, field) => {
    const { value, options } = e.target;
    const selected = Array.from(options).filter(option => option.selected).map(option => JSON.parse(option.value));
    setNewBook((prev) => ({
      ...prev,
      [field]: selected,
    }));
  };

  const handleAddNewBook = async () => {
    const formattedBook = {
      ...newBook,
      author: newBook.author[0] || null, // Ensure author is an object or null
      publisher: newBook.publisher[0] || null, // Ensure publisher is an object or null
      categories: newBook.categories // Ensure categories is an array
    };

    try {
      await axios.post(import.meta.env.VITE_APP_BASEURL + "api/v1/books", formattedBook);
      setUpdate(true);
      setNewBook({
        name: "",
        publicationYear: "",
        stock: "",
        author: [],
        publisher: [],
        categories: []
      });
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(import.meta.env.VITE_APP_BASEURL + `api/v1/books/${id}`);
      setUpdate(true);
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  const handleUpdateInput = (id) => {
    setIsUpdating(true);
    const bookToUpdate = books.find((book) => book.id === id);
    if (bookToUpdate) {
      setUpdateBook(bookToUpdate);
    }
  };

  const handleUpdateBookInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateBookBtn = async () => {
    const { id } = updateBook;
    try {
      await axios.put(import.meta.env.VITE_APP_BASEURL + `api/v1/books/${id}`, updateBook);
      setUpdate(true);
      setUpdateBook({
        id: null,
        name: "",
        publicationYear: "",
        stock: "",
        author: null,
        publisher: null,
        categories: []
      });
      setIsUpdating(false);
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  const handleSearchBookByName = (value) => {
    if (value === '') {
      setUpdate(true);
    } else {
      const searchedBook = books.filter((book) => 
        book.name.toLowerCase().includes(value.toLowerCase())
      );
      setBooks(searchedBook);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div>
        <h3>Add New Book</h3>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={newBook.name}
          onChange={handleNewBookInputChange}
        />
        <input
          type="number"
          placeholder="Publication Year"
          name="publicationYear"
          value={newBook.publicationYear}
          onChange={handleNewBookInputChange}
        />
        <input
          type="number"
          placeholder="Stock"
          name="stock"
          value={newBook.stock}
          onChange={handleNewBookInputChange}
        />
        <select multiple onChange={(e) => handleSelectChange(e, 'author')}>
          {authors.map(author => (
            <option key={author.id} value={JSON.stringify(author)}>
              {author.name}
            </option>
          ))}
        </select>
        <select multiple onChange={(e) => handleSelectChange(e, 'publisher')}>
          {publishers.map(publisher => (
            <option key={publisher.id} value={JSON.stringify(publisher)}>
              {publisher.name}
            </option>
          ))}
        </select>
        <select multiple onChange={(e) => handleSelectChange(e, 'categories')}>
          {categories.map(category => (
            <option key={category.id} value={JSON.stringify(category)}>
              {category.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddNewBook}>Add Book</button>

        {isUpdating && (
          <div>
            <h4>Update Book</h4>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={updateBook.name}
              onChange={handleUpdateBookInputChange}
            />
            <input
              type="number"
              placeholder="Publication Year"
              name="publicationYear"
              value={updateBook.publicationYear}
              onChange={handleUpdateBookInputChange}
            />
            <input
              type="number"
              placeholder="Stock"
              name="stock"
              value={updateBook.stock}
              onChange={handleUpdateBookInputChange}
            />
            <select multiple onChange={(e) => handleSelectChange(e, 'author')}>
              {authors.map(author => (
                <option key={author.id} value={JSON.stringify(author)}>
                  {author.name}
                </option>
              ))}
            </select>
            <select multiple onChange={(e) => handleSelectChange(e, 'publisher')}>
              {publishers.map(publisher => (
                <option key={publisher.id} value={JSON.stringify(publisher)}>
                  {publisher.name}
                </option>
              ))}
            </select>
            <select multiple onChange={(e) => handleSelectChange(e, 'categories')}>
              {categories.map(category => (
                <option key={category.id} value={JSON.stringify(category)}>
                  {category.name}
                </option>
              ))}
            </select>
            <button onClick={handleUpdateBookBtn}>Update Book</button>
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Search by Book Name"
        onChange={(e) => handleSearchBookByName(e.target.value)}
      />

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
                <button onClick={() => handleDeleteBook(book.id)}>DELETE</button>
                <button onClick={() => handleUpdateInput(book.id)}>UPDATE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Book;
