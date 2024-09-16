import axios from 'axios';
import { useState, useEffect } from 'react';

function Author() {
    const [authors, setAuthors] = useState([]);
    const [update, setUpdate] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [search, setSearch] = useState('');

    const [newAuthor, setNewAuthor] = useState({
        name: "",
        birthDate: "",
        country: "",
    });

    const [updateAuthor, setUpdateAuthor] = useState({
        id: null,
        name: "",
        birthDate: "",
        country: "",
    });

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_APP_BASEURL + "api/v1/authors")
            .then((res) => setAuthors(res.data))
            .catch((err) => console.error(err)) // Handle errors
            .then(() => setUpdate(false));
    }, [update]);

    const handleNewAuthorInputChange = (e) => {
        const { name, value } = e.target;
        setNewAuthor((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddNewAuthor = () => {
        axios.post(import.meta.env.VITE_APP_BASEURL + "api/v1/authors", {
            ...newAuthor,
            birthDate: new Date(newAuthor.birthDate).toISOString().split('T')[0] // Format date for backend
        })
            .then(() => setUpdate(true))
            .catch((err) => console.error(err)) // Handle errors
            .finally(() => setNewAuthor({
                name: "",
                birthDate: "",
                country: "",
            }));
    };

    const handleDeleteAuthor = (id) => {
        axios
            .delete(import.meta.env.VITE_APP_BASEURL + `api/v1/authors/${id}`)
            .then(() => setUpdate(true))
            .catch((err) => console.error(err)); // Handle errors
    };

    const handleUpdateAuthor = (id) => {
        setIsUpdating(true);
        setUpdateAuthor(authors.find((auth) => auth.id === id));
    };

    const handleUpdateAuthorInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateAuthor((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateAuthorBtn = () => {
        const { id } = updateAuthor;
        axios
            .put(`${import.meta.env.VITE_APP_BASEURL}api/v1/authors/${id}`, {
                ...updateAuthor,
                birthDate: new Date(updateAuthor.birthDate).toISOString().split('T')[0] // Format date for backend
            })
            .then(() => setUpdate(true))
            .catch((err) => console.error(err)) // Handle errors
            .finally(() => {
                setUpdateAuthor({
                    id: null,
                    name: "",
                    birthDate: "",
                    country: "",
                });
                setIsUpdating(false);
            });
    };

    const handleSearchAuthor = (value) => {
        setSearch(value);
        if (value === '') {
            setUpdate(true);
        } else {
            const searchedAuthor = authors.filter((author) =>
                author.name.toLowerCase().includes(value.toLowerCase())
            );
            setAuthors(searchedAuthor);
        }
    };

    return (
        <>
            <h3>Search Author</h3>
            <input
                type="text"
                placeholder='Search Author'
                value={search}
                onChange={(e) => handleSearchAuthor(e.target.value)}
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
                    onChange={handleNewAuthorInputChange}
                />
                <input
                    type="date"
                    placeholder='Birth Date'
                    name='birthDate'
                    value={newAuthor.birthDate}
                    onChange={handleNewAuthorInputChange}
                />
                <input
                    type="text"
                    placeholder='Country'
                    name='country'
                    value={newAuthor.country}
                    onChange={handleNewAuthorInputChange}
                />
                <button onClick={handleAddNewAuthor}>Add Author</button>

                {isUpdating &&
                    <div>
                        <div>
                            <h2>Update Author</h2>
                        </div>
                        <input
                            type="text"
                            placeholder='Name'
                            name='name'
                            value={updateAuthor.name}
                            onChange={handleUpdateAuthorInputChange}
                        />
                        <input
                            type="date"
                            placeholder='Birth Date'
                            name='birthDate'
                            value={updateAuthor.birthDate}
                            onChange={handleUpdateAuthorInputChange}
                        />
                        <input
                            type="text"
                            placeholder='Country'
                            name='country'
                            value={updateAuthor.country}
                            onChange={handleUpdateAuthorInputChange}
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
