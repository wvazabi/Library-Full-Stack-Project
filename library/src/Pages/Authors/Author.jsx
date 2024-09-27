import axios from 'axios';
import { useState, useEffect } from 'react';

function Author() {
    // State to store the list of authors
    const [authors, setAuthors] = useState([]);
    // State to trigger updates for fetching authors
    const [update, setUpdate] = useState(false);
    // State to manage the update mode
    const [isUpdating, setIsUpdating] = useState(false);
    // State to manage the search input
    const [search, setSearch] = useState('');

    // State to handle new author data
    const [newAuthor, setNewAuthor] = useState({
        name: "",
        birthDate: "",
        country: "",
    });

    // State to handle the author being updated
    const [updateAuthor, setUpdateAuthor] = useState({
        id: null,
        name: "",
        birthDate: "",
        country: "",
    });

    // Effect to fetch authors from the API on component mount and when 'update' changes
    useEffect(() => {
        axios
            .get(import.meta.env.VITE_APP_BASEURL + "api/v1/authors")
            .then((res) => setAuthors(res.data)) // Set the fetched authors to state
            .catch((err) => console.error(err)) // Handle errors
            .then(() => setUpdate(false)); // Reset update state
    }, [update]);

    // Handle input change for new author fields
    const handleNewAuthorInputChange = (e) => {
        const { name, value } = e.target;
        setNewAuthor((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle adding a new author
    const handleAddNewAuthor = () => {
        axios.post(import.meta.env.VITE_APP_BASEURL + "api/v1/authors", {
            ...newAuthor,
            birthDate: new Date(newAuthor.birthDate).toISOString().split('T')[0] // Format date for backend
        })
            .then(() => setUpdate(true)) // Trigger update after successful addition
            .catch((err) => console.error(err)) // Handle errors
            .finally(() => setNewAuthor({ // Reset new author state
                name: "",
                birthDate: "",
                country: "",
            }));
    };

    // Handle deleting an author by ID
    const handleDeleteAuthor = (id) => {
        axios
            .delete(import.meta.env.VITE_APP_BASEURL + `api/v1/authors/${id}`)
            .then(() => setUpdate(true)) // Trigger update after successful deletion
            .catch((err) => console.error(err)); // Handle errors
    };

    // Prepare to update an author
    const handleUpdateAuthor = (id) => {
        setIsUpdating(true); // Set updating state to true
        setUpdateAuthor(authors.find((auth) => auth.id === id)); // Set the author to be updated
    };

    // Handle input change for the update author fields
    const handleUpdateAuthorInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateAuthor((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle updating an author
    const handleUpdateAuthorBtn = () => {
        const { id } = updateAuthor;
        axios
            .put(`${import.meta.env.VITE_APP_BASEURL}api/v1/authors/${id}`, {
                ...updateAuthor,
                birthDate: new Date(updateAuthor.birthDate).toISOString().split('T')[0] // Format date for backend
            })
            .then(() => setUpdate(true)) // Trigger update after successful update
            .catch((err) => console.error(err)) // Handle errors
            .finally(() => {
                // Reset update author state and updating state
                setUpdateAuthor({
                    id: null,
                    name: "",
                    birthDate: "",
                    country: "",
                });
                setIsUpdating(false);
            });
    };

    // Handle searching for authors
    const handleSearchAuthor = (value) => {
        setSearch(value); // Update search state
        if (value === '') {
            setUpdate(true); // Trigger update if search is cleared
        } else {
            const searchedAuthor = authors.filter((author) =>
                author.name.toLowerCase().includes(value.toLowerCase()) // Filter authors by name
            );
            setAuthors(searchedAuthor); // Update authors state with filtered results
        }
    };

    return (
        <>
            <h3>Search Author</h3>
            <input
                type="text"
                placeholder='Search Author'
                value={search}
                onChange={(e) => handleSearchAuthor(e.target.value)} // Handle search input change
            />

            <div className='add-and-update-bar'>
                <div>
                    <h2>Add New Author</h2>
                </div>
                <input
                    type="text"
                    placeholder='Name'
                    name='name'
                    value={newAuthor.name}
                    onChange={handleNewAuthorInputChange} // Handle new author input change
                />
                <input
                    type="date"
                    placeholder='Birth Date'
                    name='birthDate'
                    value={newAuthor.birthDate}
                    onChange={handleNewAuthorInputChange} // Handle new author birth date change
                />
                <input
                    type="text"
                    placeholder='Country'
                    name='country'
                    value={newAuthor.country}
                    onChange={handleNewAuthorInputChange} // Handle new author country change
                />
                <button onClick={handleAddNewAuthor}>Add Author</button>

                {isUpdating && // Show update form if in updating mode
                    <div>
                        <div>
                            <h2>Update Author</h2>
                        </div>
                        <input
                            type="text"
                            placeholder='Name'
                            name='name'
                            value={updateAuthor.name}
                            onChange={handleUpdateAuthorInputChange} // Handle updated author name change
                        />
                        <input
                            type="date"
                            placeholder='Birth Date'
                            name='birthDate'
                            value={updateAuthor.birthDate}
                            onChange={handleUpdateAuthorInputChange} // Handle updated author birth date change
                        />
                        <input
                            type="text"
                            placeholder='Country'
                            name='country'
                            value={updateAuthor.country}
                            onChange={handleUpdateAuthorInputChange} // Handle updated author country change
                        />
                        <button onClick={handleUpdateAuthorBtn}>Update Author</button>
                    </div>
                }
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Author Name</th>
                        <th>Birth Date</th>
                        <th>Country</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {authors.map((author) => (
                        <tr key={author.id}>
                            <td>{author.name}</td>
                            <td>{new Date(author.birthDate).toLocaleDateString()}</td> 
                            <td>{author.country}</td>
                            <td>
                                <button onClick={() => handleDeleteAuthor(author.id)}>DELETE</button>
                                <button onClick={() => handleUpdateAuthor(author.id)}>UPDATE</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default Author;
