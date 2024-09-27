import { useState, useEffect } from 'react';
import axios from 'axios';

function Category() {
    // State variables
    const [categories, setCategories] = useState([]); // To hold the list of categories
    const [update, setUpdate] = useState(false); // To trigger updates
    const [isUpdating, setIsUpdating] = useState(false); // To manage update mode
    const [newCategory, setNewCategory] = useState({ name: "", description: "" }); // For adding new categories
    const [updateCategory, setUpdateCategory] = useState({ id: null, name: "", description: "" }); // For updating categories

    // Fetch categories on component mount or when 'update' changes
    useEffect(() => {
        axios
            .get(import.meta.env.VITE_APP_BASEURL + "api/v1/categories")
            .then((res) => setCategories(res.data)) // Set fetched categories
            .catch((error) => console.error('Error fetching categories:', error))
            .finally(() => setUpdate(false)); // Reset update flag
    }, [update]);

    // Handle input change for new category
    const handleNewCategoryInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategory((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Add a new category
    const handleAddNewCategory = () => {
        axios.post(import.meta.env.VITE_APP_BASEURL + "api/v1/categories", newCategory)
            .then(() => setUpdate(true)) // Trigger update after adding
            .catch((error) => console.error('Error adding category:', error))
            .finally(() => setNewCategory({ name: "", description: "" })); // Reset input fields
    };

    // Delete a category
    const handleDeleteCategory = (id) => {
        axios
            .delete(import.meta.env.VITE_APP_BASEURL + `api/v1/categories/${id}`)
            .then(() => setUpdate(true)) // Trigger update after deletion
            .catch((error) => console.error('Error deleting category:', error));
    };

    // Set the category to update
    const handleUpdateCategory = (id) => {
        setIsUpdating(true);
        const categoryToUpdate = categories.find((cat) => cat.id === id);
        if (categoryToUpdate) {
            setUpdateCategory(categoryToUpdate); // Load category data into update form
        }
    };

    // Handle input change for updating category
    const handleUpdateCategoryInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateCategory((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Update the category
    const handleUpdateCategoryBtn = () => {
        const { id } = updateCategory;
        axios
            .put(import.meta.env.VITE_APP_BASEURL + `api/v1/categories/${id}`, updateCategory)
            .then(() => setUpdate(true)) // Trigger update after updating
            .catch((error) => console.error('Error updating category:', error))
            .finally(() => {
                setUpdateCategory({ id: null, name: "", description: "" }); // Reset update state
                setIsUpdating(false); // Exit update mode
            });
    };

    // Search categories by name
    const handleSearchCategory = (value) => {
        if (value === '') {
            setUpdate(true); // Reset to original list if search is empty
        } else {
            const searchedCategory = categories.filter((category) =>
                category.name.toLowerCase().includes(value.toLowerCase())
            );
            setCategories(searchedCategory); // Set filtered categories
        }
    };

    return (
        <>
            <h3>Search Category</h3>
            <input
                type="text"
                placeholder='Search Category'
                onChange={(e) => handleSearchCategory(e.target.value)} // Handle search input
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
                    onChange={handleNewCategoryInputChange} // Handle new category input
                />
                <input
                    type="text"
                    placeholder='Description'
                    name='description'
                    value={newCategory.description}
                    onChange={handleNewCategoryInputChange} // Handle new category description input
                />
                <button onClick={handleAddNewCategory}>Add Category</button>

                {isUpdating && (
                    <div>
                        <div>
                            <h2>Update Category</h2>
                        </div>
                        <input
                            type="text"
                            placeholder='Name'
                            name='name'
                            value={updateCategory.name}
                            onChange={handleUpdateCategoryInputChange} // Handle update input
                        />
                        <input
                            type="text"
                            placeholder='Description'
                            name='description'
                            value={updateCategory.description}
                            onChange={handleUpdateCategoryInputChange} // Handle update description input
                        />
                        <button onClick={handleUpdateCategoryBtn}>Update Category</button>
                    </div>
                )}
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Category Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index) => (
                        <tr key={index}>
                            <td>{category.name}</td>
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
