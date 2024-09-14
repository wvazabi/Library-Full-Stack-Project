import { useState, useEffect } from 'react';
import axios from 'axios';

function Category() {
    const [categories, setCategories] = useState([]);
    const [update, setUpdate] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [search, setSearch] = useState('');
    const [newCategory, setNewCategory] = useState({
        name: "",
        description: "",
    });
    const [updateCategory, setUpdateCategory] = useState({
        id: null,
        name: "",
        description: "",
    });

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_APP_BASEURL + "v1/categories", {
                params: {
                    page: 0, // başlangıç sayfası
                    pageSize: 10 // sayfa boyutu
                }
            })
            .then((res) => setCategories(res.data.content))
            .catch((error) => console.error('Error fetching categories:', error))
            .finally(() => setUpdate(false));
    }, [update]);

    const handleNewCategoryInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategory((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddNewCategory = () => {
        axios.post(import.meta.env.VITE_APP_BASEURL + "v1/categories", newCategory)
            .then(() => setUpdate(true))
            .catch((error) => console.error('Error adding category:', error))
            .finally(() => setNewCategory({ name: "", description: "" }));
    };

    const handleDeleteCategory = (id) => {
        axios
            .delete(import.meta.env.VITE_APP_BASEURL + `v1/categories/${id}`)
            .then(() => setUpdate(true))
            .catch((error) => console.error('Error deleting category:', error));
    };

    const handleUpdateCategory = (id) => {
        setIsUpdating(true);
        setUpdateCategory(categories.find((cat) => cat.id === id));
    };

    const handleUpdateCategoryInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateCategory((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateCategoryBtn = () => {
        axios
            .put(import.meta.env.VITE_APP_BASEURL + "v1/categories", updateCategory)
            .then(() => setUpdate(true))
            .catch((error) => console.error('Error updating category:', error))
            .finally(() => {
                setUpdateCategory({ id: null, name: "", description: "" });
                setIsUpdating(false);
            });
    };

    const handleSearchCategory = (value) => {
        if (value === '') {
            setUpdate(true);
        } else {
            const searchedCategory = categories.filter((category) =>
                category.name.toLowerCase().includes(value.toLowerCase())
            );
            setCategories(searchedCategory);
        }
    };

    return (
        <>
            <h3>Search Category</h3>
            <input
                type="text"
                placeholder='Search Category'
                onChange={(e) => handleSearchCategory(e.target.value)}
            />

            <div className='add-and-update-bar'>
                <div>
                    <h2>Add New Category</h2>
                </div>
                <input
                    type="text"
                    placeholder='Name'
                    name='name'
                    value={newCategory.name}
                    onChange={handleNewCategoryInputChange}
                />
                <input
                    type="text"
                    placeholder='Description'
                    name='description'
                    value={newCategory.description}
                    onChange={handleNewCategoryInputChange}
                />
                <button onClick={handleAddNewCategory}>Add Category</button>

                {isUpdating &&
                    <div>
                        <div>
                            <h2>Update Category</h2>
                        </div>
                        <input
                            type="text"
                            placeholder='Name'
                            name='name'
                            value={updateCategory.name}
                            onChange={handleUpdateCategoryInputChange}
                        />
                        <input
                            type="text"
                            placeholder='Description'
                            name='description'
                            value={updateCategory.description}
                            onChange={handleUpdateCategoryInputChange}
                        />
                        <button onClick={handleUpdateCategoryBtn}>Update Category</button>
                    </div>
                }
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Category Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>
                                <button onClick={() => handleDeleteCategory(category.id)}>DELETE</button>
                                <button onClick={() => handleUpdateCategory(category.id)}>UPDATE</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default Category;
