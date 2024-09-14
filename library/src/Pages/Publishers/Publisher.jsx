import axios from 'axios';
import { useState, useEffect } from 'react';
import './publisher.css';

function Publisher() {
    const [publishers, setPublishers] = useState([]);
    const [update, setUpdate] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [newPublisher, setNewPublisher] = useState({
        name: "",
        establishmentYear: "",  // Change to year type
        address: "",
    });

    const [updatePublisher, setUpdatePublisher] = useState({
        id: null,
        name: "",
        establishmentYear: "",
        address: "",
    });

    // Generate a list of years for the year picker
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, index) => currentYear - index);

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_APP_BASEURL + "api/v1/publishers")
            .then((res) => setPublishers(res.data.content))
            .then(() => setUpdate(false));
    }, [update]);

    const handleNewPublisherInputChange = (e) => {
        const { name, value } = e.target;
        setNewPublisher((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddNewPublisher = () => {
        axios.post(import.meta.env.VITE_APP_BASEURL + "api/v1/publishers", newPublisher)
            .then(() => setUpdate(true))
            .then(() => setNewPublisher({
                name: "",
                establishmentYear: "",
                address: "",
            }));
    };

    const handleDeletePublisher = (id) => {
        axios
            .delete(import.meta.env.VITE_APP_BASEURL + `api/v1/publishers/${id}`)
            .then(() => setUpdate(true));
    };

    const handleUpdatePublisher = (id) => {
        setIsUpdating(true);
        setUpdatePublisher(publishers.find((pub) => pub.id === id));
    };

    const handleUpdatePublisherInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatePublisher((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdatePublisherBtn = () => {
        const { id } = updatePublisher;
        axios
            .put(`${import.meta.env.VITE_APP_BASEURL}api/v1/publishers/${id}`, updatePublisher)
            .then(() => setUpdate(true))
            .then(() => setUpdatePublisher({
                id: null,
                name: "",
                establishmentYear: "",
                address: "",
            }))
            .then(() => setIsUpdating(false));
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
                <select
                    name='establishmentYear'
                    value={newPublisher.establishmentYear}
                    onChange={handleNewPublisherInputChange}
                >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
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
                        <select
                            name='establishmentYear'
                            value={updatePublisher.establishmentYear}
                            onChange={handleUpdatePublisherInputChange}
                        >
                            <option value="">Select Year</option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
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
                            <td>{publisher.establishmentYear}</td>
                            <td>{publisher.address}</td>
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
