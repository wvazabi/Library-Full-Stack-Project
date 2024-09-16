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
    publicationYear: "", // Publication year should be an integer
    stock: "",
    author: "", // This will hold the selected author ID
    publisher: "", // This will hold the selected publisher ID
    categories: [] // This will hold an array of selected category IDs
  });

  const [updateBook, setUpdateBook] = useState({
    id: null,
    name: "",
    publicationYear: "",
    stock: "",
    author: "",
    publisher: "",
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

  const handleAddNewBook = async () => {
    try {
      await axios.post(import.meta.env.VITE_APP_BASEURL + "api/v1/books", newBook);
      setUpdate(true);
      setNewBook({
        name: "",
        publicationYear: "",
        stock: "",
        author: "",
        publisher: "",
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

  const handleUpdateBook = (id) => {
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
    try {
      await axios.put(import.meta.env.VITE_APP_BASEURL + `api/v1/books/${updateBook.id}`, updateBook);
      setUpdate(true);
      setUpdateBook({
        id: null,
        name: "",
        publicationYear: "",
        stock: "",
        author: "",
        publisher: "",
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
          placeholder="Book Name"
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
        <select
          name="author"
          value={newBook.author}
          onChange={handleNewBookInputChange}
        >
          <option value="">Select Author</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
        <select
          name="publisher"
          value={newBook.publisher}
          onChange={handleNewBookInputChange}
        >
          <option value="">Select Publisher</option>
          {publishers.map((publisher) => (
            <option key={publisher.id} value={publisher.id}>
              {publisher.name}
            </option>
          ))}
        </select>
        <select
          multiple
          name="categories"
          value={newBook.categories}
          onChange={(e) =>
            setNewBook({
              ...newBook,
              categories: Array.from(
                e.target.selectedOptions,
                (option) => option.value
              ),
            })
          }
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
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
              placeholder="Book Name"
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
            <select
              name="author"
              value={updateBook.author}
              onChange={handleUpdateBookInputChange}
            >
              <option value="">Select Author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
            <select
              name="publisher"
              value={updateBook.publisher}
              onChange={handleUpdateBookInputChange}
            >
              <option value="">Select Publisher</option>
              {publishers.map((publisher) => (
                <option key={publisher.id} value={publisher.id}>
                  {publisher.name}
                </option>
              ))}
            </select>
            <select
              multiple
              name="categories"
              value={updateBook.categories}
              onChange={(e) =>
                setUpdateBook({
                  ...updateBook,
                  categories: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                })
              }
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button onClick={handleUpdateBookBtn}>Update Book</button>
          </div>
        )}
      </div>

      <h3>Book List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
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
              <td>{book.author?.name}</td>
              <td>{book.publisher?.name}</td>
              <td>
                {book.categories?.map((category) => category.name).join(', ')}
              </td>
              <td>
                <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
                <button onClick={() => handleUpdateBook(book.id)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Book;
