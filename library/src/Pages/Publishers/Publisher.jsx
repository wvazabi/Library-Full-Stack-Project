import axios from 'axios'
import { useState, useEffect } from 'react'
import './publisher.css'

function Publisher() {
  const [availableDates, setAvailableDates] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [update, setUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newAvailableDate, setNewAvailableDate] = useState({
    workDay: "",
    doctorId: "",
  })

  const [updateAvailableDate, setUpdateAvailableDate] = useState({
    workDay: "",
    doctorId: "",
  })
    
  

  useEffect(() => {
    axios
    .get(import.meta.env.VITE_APP_BASEURL + "api/v1/available-dates")
    .then((res) => setAvailableDates(res.data.content))
    .then(() => console.log(availableDates))

    axios
    .get(import.meta.env.VITE_APP_BASEURL + "api/v1/doctors")
    .then((res) => setDoctors(res.data.content))
    .then(() => setUpdate(false))
  }, [update])

  const handleNewAvailableDateInputChange = (e) => {
    const { name, value} = e.target;
    setNewAvailableDate((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddNewAvailableDate = () => {
    axios.post(import.meta.env.VITE_APP_BASEURL + "api/v1/available-dates", newAvailableDate)
    // .then((res) => console.log(res))
    .then(() => setUpdate(true) )
    .then(setNewAvailableDate({
      workDay: "",
      doctorId: "",
    }))
  }

  const handleDeleteInput = (e) => {
    const {id} = e.target
    axios
    .delete(import.meta.env.VITE_APP_BASEURL + `api/v1/available-dates/${id}`)
    .then(() => setUpdate(true))
  }

  const handleUpdateInput = (e) => {
    const id = e.target.id;
    setIsUpdating(true)
    setUpdateAvailableDate(availableDates.find((date) => date.id == id))
  }

  const handleUpdateAvailableDateInputChange = (e) => {
    const  { name, value  }= e.target
    setUpdateAvailableDate((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddNewAvailableDateBtn = (e) => {
    const { id } = updateAvailableDate
    axios
    .put(`${import.meta.env.VITE_APP_BASEURL} + api/v1/available-dates/${id}`, updateAvailableDate)
    .then(() => setUpdate(true))
    .then(() => setUpdateAvailableDate({
      workDay: "",
      doctorId: ""
    }))
    .then(() => setIsUpdating(false))
  }
  
  const handleSearchByDoctorName = (value) => {
    if(value == ''){
      setUpdate(true)
    } else {
      const searchedByDoctor = availableDates.filter((date) => date.doctor.name.toLowerCase().includes(value))
      setAvailableDates(searchedByDoctor);
    }
  }



  return (
    <>

      <div>
        <h3>Search By Doctor Name</h3>
        <input 
        type="text"
        placeholder='Search by Doctor Name'
        onChange={(e) => handleSearchByDoctorName(e.target.value)}
        />
      </div>
      <div className='add-and-update-bar'>
        <h2>Add New AvailableDate</h2>
        <input 
        type="date"
        placeholder='Available Date'
        name='workDay'
        value={newAvailableDate.workDay}
        onChange={handleNewAvailableDateInputChange}
        />
        <select 
        name="doctorId" 
        onChange={handleNewAvailableDateInputChange}>
          <option value={newAvailableDate.doctorId || ""}>Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
      
        <button onClick={handleAddNewAvailableDate}> Add AvailableDate</button>
      

    
        {isUpdating &&
        <div>
          <div>
            <h4>Update AvailableDate</h4>
          </div>
          <input 
          type="text"
          placeholder='Available Date'
          name='workDay'
          value={updateAvailableDate.workDay}
          onChange={handleUpdateAvailableDateInputChange}
          />

          <select name="doctorId" >
            <option value={newAvailableDate.doctorId || ""}>Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        
          
          <button onClick={handleAddNewAvailableDateBtn}> Update AvailableDate</button>
        </div>
        }
      </div>
      

      <table>
        <thead>
          <tr>
            <th>Available Date</th>
            <th>Doctor Name</th>
          </tr>
        </thead>
        <tbody>
          {availableDates.map((date, index) => (
            <tr key={index}>
              <td>{date.workDay}</td>
              <td>{date.doctor.name}</td>
              <button id={date.id} onClick={handleDeleteInput}>DELETE</button>
              <button id={date.id} onClick={handleUpdateInput}>UPDATE</button>
            </tr>
          ))}
          <tr></tr>

        </tbody>
      </table>

{/* 
      {availableDates?.map((date) => (
        <div key={date.id}>
          <li>
            {date.workDay} - {date.doctor.name} - 
            <span id={date.id} onClick={handleDeleteInput}>DELETE</span> - 
            <span id={date.id} onClick={handleUpdateInput}>UPDATE</span>
          </li>

        </div>
      ))
      
      } */}
    </>
  )
}

export default Publisher;