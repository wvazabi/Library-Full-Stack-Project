import axios from 'axios';
import { useState, useEffect } from 'react';
import './publisher.css';

function Publisher() {
    const [publishers, setPublishers] = useState([]);
    const [update, setUpdate] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [newPublisher, setNewPublisher] = useState({
        name: "",
        establishmentYear: "",  
        address: "",  // Added address field to match entity
    });

    const [updatePublisher, setUpdatePublisher] = useState({
        id: null,
        name: "",
        establishmentYear: "",
        address: "", // Added address field
    });

    // Fetching publishers on component load and after updates
    useEffect(() => {
        axios
            .get(import.meta.env.VITE_APP_BASEURL + "api/v1/publishers")
            .then((res) => setPublishers(res.data))
            .catch((error) => console.error('Error fetching publishers:', error))
            .finally(() => setUpdate(false));
    }, [update]);

    // Handle new publisher input changes
    const handleNewPublisherInputChange = (e) => {
        const { name, value } = e.target;
        setNewPublisher((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Add new publisher
    const handleAddNewPublisher = () => {
        axios.post(import.meta.env.VITE_APP_BASEURL + "api/v1/publishers", newPublisher)
            .then(() => setUpdate(true))
            .catch((error) => console.error('Error adding publisher:', error))
            .finally(() => setNewPublisher({
                name: "",
                establishmentYear: "",
                address: "", // Resetting address field
            }));
    };

    // Delete publisher by ID
    const handleDeletePublisher = (id) => {
        axios
            .delete(import.meta.env.VITE_APP_BASEURL + `api/v1/publishers/${id}`)
            .then(() => setUpdate(true))
            .catch((error) => console.error('Error deleting publisher:', error));
    };

    // Set publisher for update
    const handleUpdatePublisher = (id) => {
        setIsUpdating(true);
        setUpdatePublisher(publishers.find((pub) => pub.id === id));
    };

    // Handle update publisher input changes
    const handleUpdatePublisherInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatePublisher((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Submit the updated publisher
    const handleUpdatePublisherBtn = () => {
        axios
            .put(import.meta.env.VITE_APP_BASEURL + `api/v1/publishers/${updatePublisher.id}`, updatePublisher)
            .then(() => setUpdate(true))
            .catch((error) => console.error('Error updating publisher:', error))
            .finally(() => {
                setUpdatePublisher({ id: null, name: "", establishmentYear: "", address: "" });
                setIsUpdating(false);
            });
    };

    return (
        <>
            <div>
                <h3>Add New Publisher</h3>
                <input
                    type="text"
                    placeholder='Name'
                    name='name'
                    value={newPublisher.name}
                    onChange={handleNewPublisherInputChange}
                />
                <input
                    type="text"
                    placeholder='Establishment Year'
                    name='establishmentYear'
                    value={newPublisher.establishmentYear}
                    onChange={handleNewPublisherInputChange}
                />
                <input
                    type="text"
                    placeholder='Address'
                    name='address'
                    value={newPublisher.address}
                    onChange={handleNewPublisherInputChange}
                />
                <button onClick={handleAddNewPublisher}>Add Publisher</button>

                {isUpdating &&
                    <div>
                        <h4>Update Publisher</h4>
                        <input
                            type="text"
                            placeholder='Name'
                            name='name'
                            value={updatePublisher.name}
                            onChange={handleUpdatePublisherInputChange}
                        />
                        <input
                            type="text"
                            placeholder='Establishment Year'
                            name='establishmentYear'
                            value={updatePublisher.establishmentYear}
                            onChange={handleUpdatePublisherInputChange}
                        />
                        <input
                            type="text"
                            placeholder='Address'
                            name='address'
                            value={updatePublisher.address}
                            onChange={handleUpdatePublisherInputChange}
                        />
                        <button onClick={handleUpdatePublisherBtn}>Update Publisher</button>
                    </div>
                }
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Publisher Name</th>
                        <th>Establishment Year</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {publishers.map((publisher) => (
                        <tr key={publisher.id}>
                            <td>{publisher.name}</td>
                            <td>{publisher.establishmentYear}</td> {/* Establishment Year */}
                            <td>{publisher.address}</td> {/* Address */}
                            <td>
                                <button onClick={() => handleDeletePublisher(publisher.id)}>DELETE</button>
                                <button onClick={() => handleUpdatePublisher(publisher.id)}>UPDATE</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default Publisher;
