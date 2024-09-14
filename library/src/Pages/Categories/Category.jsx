import { useState, useEffect } from 'react';
import axios from 'axios';

function Category() {
    const [doctors, setDoctors] = useState([])
    const [update, setUpdate] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [search, setSearch] = useState('')
 


    const [newDoctor, setNewDoctor] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
    })

    const [updateDoctor, setUpdateDoctor] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
    })

    useEffect(() => {
        axios
        .get(import.meta.env.VITE_APP_BASEURL + "api/v1/doctors")
        .then((res) => setDoctors(res.data.content))
        .then(() => setUpdate(false))
      }, [update])

      const handleNewDoctorInputChange = (e) => {
        const { name, value} = e.target;
        setNewDoctor((prev) => ({
          ...prev,
          [name]: value,
        }))
      }

      const handleAddNewDoctor = () => {
        axios.post(import.meta.env.VITE_APP_BASEURL + "api/v1/doctors", newDoctor)
        // .then((res) => console.log(res))
        .then(() => setUpdate(true) )
        .then(setNewDoctor({
          name: "",
          phone: "",
          email: "",
          address: "",
          city: ""
        }))
      }

      const handleDeleteInput = (e) => {
        const {id} = e.target
        axios
        .delete(import.meta.env.VITE_APP_BASEURL + `api/v1/doctors/${id}`)
        .then(() => setUpdate(true))
      }

      const handleUpdateInput = (e) => {
        const id = e.target.id;
        setIsUpdating(true)
        setUpdateDoctor(doctors.find((doc) => doc.id == id))
      }

      const handleUpdateDoctorInputChange = (e) => {
        const  { name, value  }= e.target
        setUpdateDoctor((prev) => ({
          ...prev,
          [name]: value,
        }))
      }

      const handleUpdateDoctorBtn = (e) => {
        const { id } = updateDoctor
        axios
        .put(`${import.meta.env.VITE_APP_BASEURL}api/v1/doctors/${id}`, updateDoctor)
        .then(() => setUpdate(true))
        .then(() => setUpdateDoctor({
          name: "",
          phone: "",
          email: "",
          address: "",
          city: ""
        }))
        .then(() => setIsUpdating(false))
      }

      const handleSearchDoctor = (value) => {
        if(value == ''){
          setUpdate(true)
        }else {
          const searchedDoctor = doctors.filter((doctor) => doctor.name.toLowerCase().includes(value))
          setDoctors(searchedDoctor)
        }
      }


  return (
    <>
        <h3>Search Doctor</h3>
        <input 
        type="text"
        placeholder='Search Doctor'
        onChange={(e) => handleSearchDoctor(e.target.value)}
        />
        
        
        <div className='add-and-update-bar'>
          <div>
            <h2>Add New Doctor</h2>
          </div>
          <input 
          type="text"
          placeholder='Name'
          name='name'
          value={newDoctor.name}
          onChange={handleNewDoctorInputChange}
          />
          <input 
          type="text"
          placeholder='phone'
          name='phone'
          value={newDoctor.phone}
          onChange={handleNewDoctorInputChange}
          />
          <input 
          type="text"
          placeholder='email'
          name='email'
          value={newDoctor.email}
          onChange={handleNewDoctorInputChange}
          />
          <input 
          type="text"
          placeholder='address'
          name='address'
          value={newDoctor.address}
          onChange={handleNewDoctorInputChange}
          />
          <input 
          type="text"
          placeholder='city'
          name='city'
          value={newDoctor.city}
          onChange={handleNewDoctorInputChange}
          />
          <button onClick={handleAddNewDoctor}> Add Doctor</button>
    
        
          {isUpdating &&
          
          <div>
          
            <div>
              <h2>Update Doctor</h2>
            </div>
            <input 
            type="text"
            placeholder='Name'
            name='name'
            value={updateDoctor.name}
            onChange={handleUpdateDoctorInputChange}
            />
            <input 
            type="text"
            placeholder='phone'
            name='phone'
            value={updateDoctor.phone}
            onChange={handleUpdateDoctorInputChange}
            />
            <input 
            type="text"
            placeholder='email'
            name='email'
            value={updateDoctor.email}
            onChange={handleUpdateDoctorInputChange}
            />
            <input 
            type="text"
            placeholder='address'
            name='address'
            value={updateDoctor.address}
            onChange={handleUpdateDoctorInputChange}
            />
            <input 
            type="text"
            placeholder='city'
            name='city'
            value={updateDoctor.city}
            onChange={handleUpdateDoctorInputChange}
            />
            <button onClick={handleUpdateDoctorBtn}> Update Doctor</button>
          </div>
          }
        </div>


     
        {/* <ul>
          {filteredData.map((doctor, index) => (
            <li key={index}> {doctor.name} - {doctor.phone}</li>
          ) )}
        </ul> */}
        

        <table>
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Doctor Phone</th>
              <th>Doctor Email</th>
              <th>Doctor Address</th>
              <th>Doctor City</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={index}>
                <td>{doctor.name}</td>
                <td>{doctor.phone}</td>
                <td>{doctor.email}</td>
                <td>{doctor.address}</td>
                <td>{doctor.city}</td>
                <button id={doctor.id} onClick={handleDeleteInput}>DELETE</button>
                <button id={doctor.id} onClick={handleUpdateInput}>UPDATE</button>
              </tr>
            ))}
            

          </tbody>
        </table>
  
  
        {/* {doctors?.filter((doctor) => {
          return search.toLowerCase() === '' ? doctor : doctor.name.toLowerCase().includes(search)
        })
        .map((doctor) => (
          <div key={doctor.id}>
            <li>
              {doctor.name} - {doctor.phone} -{doctor.email} - {doctor.address} - {doctor.city} - 
              <span id={doctor.id} onClick={handleDeleteInput}>DELETE</span> - 
              <span id={doctor.id} onClick={handleUpdateInput}>UPDATE</span>
            </li>
  
          </div>
        ))
        
        } */}
      </>
  )
}

export default Category