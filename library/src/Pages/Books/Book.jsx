import axios from 'axios'
import { useState, useEffect } from 'react'
import './book.css'

function Book() {
  const [animals, setAnimals] = useState([]);
  const [customers, setCustomers] = useState([])
  const [update, setUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false)
  const [newAnimal, setNewAnimal] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "",
    dateOfBirth: "",
    colour: "",
    customer: ""
  })
  const [updateAnimal, setUpdateAnimal] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "",
    dateOfBirth: "",
    colour: "",
    customer: ""
  })

  useEffect(() => {
    axios
    .get(import.meta.env.VITE_APP_BASEURL + "api/v1/animals")
    .then((res) => setAnimals(res.data.content));

    axios
    .get(import.meta.env.VITE_APP_BASEURL + "api/v1/customers")
    .then((res) => setCustomers(res.data.content))
    .then(() => setUpdate(false))
    

  }, [update])

  const handleNewAnimalInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnimal((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddNewAnimal = () => {
    axios
    .post(import.meta.env.VITE_APP_BASEURL + "api/v1/animals", newAnimal)
    .then(() => setUpdate(true))
    .then(setNewAnimal({
      name: "",
      species: "",
      breed: "",
      gender: "",
      dateOfBirth: "",
      colour: "",
      customer: ""
    }))
  }

  const handleDeleteInput = (e) => {
    const {id} = e.target
    axios
    .delete(import.meta.env.VITE_APP_BASEURL + `api/v1/animals/${id}`)
    .then(() => setUpdate(true))
  }

  const handleUpdateInput = (e) => {
    const {id} = e.target;
    setIsUpdating(true)
    setUpdateAnimal(animals.find((animal)=> animal.id == id))
  }

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const obj = customers.find((customer) => customer.id === +value)
    console.log(obj);
    setNewAnimal({
      ...newAnimal,
      [name]: obj,
    })
  }

  const handleUpdateAnimalInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateAnimal((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleUpdateAnimalBtn = (e) => {
    const { id } = updateAnimal
    axios
    .put(import.meta.env.VITE_APP_BASEURL + `api/v1/animals/${id}`, updateAnimal)
    .then(() => setUpdate(true))
    .then(() => setUpdateAnimal({
      name: "",
      species: "",
      breed: "",
      gender: "",
      dateOfBirth: "",
      colour: "",
      customer: ""
    }))
    .then(() => setIsUpdating(false))
  }

  const handleSearchAnimalByAnimalName = (value) => {
    if(value == ''){
      setUpdate(true)
    } else  {
      const searchedAnimal = animals.filter((animal) => animal.name.toLowerCase().includes(value))
      setAnimals(searchedAnimal)
    }
    
  }

  const handleSearchAnimalByCustomerName = (value) => {
    if(value == ''){
      setUpdate(true)
    } else  {
      const searchedAnimal = animals.filter((animal) => animal.customer.name.toLowerCase().includes(value))
      setAnimals(searchedAnimal)
    }
  }

  return (
    <>
      <div className='search-bar'>
        <div>
          <h3>Search Animal By Name</h3>
          <input
          type="text"
          placeholder='Animal Name'
          onChange={(e) => handleSearchAnimalByAnimalName(e.target.value)}
          />
        </div>
        <div>
          <h3>Search Animal By Customer Name</h3>
          <input
          type="text"
          placeholder='Animal Name'
          onChange={(e) => handleSearchAnimalByCustomerName(e.target.value)}
          />
        </div> 
      </div>
      <div className='add-and-update-bar'>
        <h2>Add New Animal</h2>
        <input
        type="text"
        placeholder='name'
        name="name"
        value={newAnimal.name}
        onChange={handleNewAnimalInputChange} />
        <input
        type="text"
        placeholder='species'
        name="species"
        value={newAnimal.species}
        onChange={handleNewAnimalInputChange} />
        <input
        type="text"
        placeholder='breed'
        name="breed"
        value={newAnimal.breed}
        onChange={handleNewAnimalInputChange} />
        <input
        type="text"
        placeholder='gender'
        name="gender"
        value={newAnimal.gender}
        onChange={handleNewAnimalInputChange} />
        <input
        type="date"
        placeholder='dateOfBirth'
        name="dateOfBirth"
        value={newAnimal.dateOfBirth}
        onChange={handleNewAnimalInputChange} />
        <input
        type="text"
        placeholder='colour'
        name="colour"
        value={newAnimal.colour}
        onChange={handleNewAnimalInputChange} />

        <select name="customer" onChange={handleSelectChange}>
          <option value="">Select Customer</option>
            {customers?.map((customer) =>(
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
        </select>

        <button onClick={handleAddNewAnimal}>Add Animal</button>
      

        {isUpdating &&
        <div>
          <h2>Update Animal</h2>
          <input
          type="text"
          placeholder='name'
          name="name"
          value={updateAnimal.name}
          onChange={handleUpdateAnimalInputChange} />
          <input
          type="text"
          placeholder='species'
          name="species"
          value={updateAnimal.species}
          onChange={handleUpdateAnimalInputChange} />
          <input
          type="text"
          placeholder='breed'
          name="breed"
          value={updateAnimal.breed}
          onChange={handleUpdateAnimalInputChange} />
          <input
          type="text"
          placeholder='gender'
          name="gender"
          value={updateAnimal.gender}
          onChange={handleUpdateAnimalInputChange} />
          <input
          type="date"
          placeholder='dateOfBirth'
          name="dateOfBirth"
          value={updateAnimal.dateOfBirth}
          onChange={handleUpdateAnimalInputChange} />
          <input
          type="text"
          placeholder='colour'
          name="colour"
          value={updateAnimal.colour}
          onChange={handleUpdateAnimalInputChange} />
          <select name="customer" disabled>
            <option value={updateAnimal.customer.name}>{updateAnimal.customer.name}</option>
              {/* {customers?.map((customer) =>(
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))} */}
          </select>
          <button onClick={handleUpdateAnimalBtn}>Update Animal</button>
        </div>
      }
    </div>


    <table>
        <thead>
            <tr>
              <th>Animal Name</th>
              <th>Animal Species</th>
              <th>Animal Breed</th>
              <th>Animal Gender</th>
              <th>Animal Date of Birth</th>
              <th>Animal Owner</th>
            </tr>
        </thead>
        <tbody>

          {animals.map((animal, index) => (
            <tr key={index}>
              <td>{animal.name}</td>
              <td>{animal.species}</td>
              <td>{animal.breed}</td>
              <td>{animal.gender}</td>
              <td>{animal.dateOfBirth}</td>
              <td>{animal.customer.name}</td>
              <button id={animal.id} onClick={handleDeleteInput}>DELETE</button>
              <button id={animal.id} onClick={handleUpdateInput}>UPDATE</button>
            </tr>

            ))}
            
        </tbody>
    </table>

    {/* name: "",
    species: "",
    breed: "",
    gender: "",
    dateOfBirth: "",
    colour: "",
    customer: "" */}
      
{/* 
      <ul>


          {animals.map((animal) => (
            <div key={animal.id}>
              <li>
                {animal.name} - {animal.colour} - {animal.species} - 
                {animal.customer.name} - {animal.dateOfBirth} - 

                <span id={animal.id} onClick={handleDeleteInput}>DELETE</span> - 
                <span id={animal.id} onClick={handleUpdateInput}>UPDATE</span>
                </li>
            </div>          
          ))}
      </ul> */}

      
    </>
  )
}

export default Book;