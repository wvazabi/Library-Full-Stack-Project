import axios from 'axios'
import { useState, useEffect, useRef } from 'react'

function BookBorrowing() {

  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [animals, setAnimals] = useState([])
  const [update, setUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const searchByDoctorAndDateRangeDoctorRef = useRef(null)
  const searchByDoctorAndDateRangeDateStartRef = useRef(null)
  const searchByDoctorAndDateRangeDateFinishRef = useRef(null)

  const searchByAnimalAndDateRangeAnimalRef = useRef(null)
  const searchByAnimalAndDateRangeDateStartRef = useRef(null)
  const searchByAnimalAndDateRangeDateFinishRef = useRef(null)

  const [newAppointment, setNewAppointment] = useState({
    appointmentDate: "",
    doctor: "",
    animal: ""
  })
  const [updateAppointment, setUpdateAppointment] = useState({
    appointmentDate: "",
    doctor: "",
    animal: ""
  })

  useEffect(() => {
    axios
    .get(import.meta.env.VITE_APP_BASEURL + "api/v1/appointments")
    .then((res) => {
      setAppointments(res.data.content);
      // console.log(res.data.content);    
    })

    axios
    .get(import.meta.env.VITE_APP_BASEURL + "api/v1/doctors")
    .then((res) => setDoctors(res.data.content))

    axios
    .get(import.meta.env.VITE_APP_BASEURL + "api/v1/animals")
    .then((res) => setAnimals(res.data.content))
    .then(() => setUpdate(false))
  }, [update])

  const handleNewAppointmentInputChange = (e) => {
    const {name, value} = e.target
    setNewAppointment((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNewAppointmentDoctor = (e) => {
    const {name, value} = e.target
    const doctorObj = doctors.find((doctor) => doctor.id == value)
    setNewAppointment({
      ...newAppointment,
      [name]: doctorObj,
    })
  }

  const handleNewAppointmentAnimal = (e) => {
    const {name, value} = e.target
    const animalObj = animals.find((animal) => animal.id == value)
    setNewAppointment((prev) => ({
      ...prev,
      [name]: animalObj
    }))
  }

  const handleAddNewAppointment = () => {
    axios
    .post(import.meta.env.VITE_APP_BASEURL + "api/v1/appointments", newAppointment)
    .then(() => setUpdate(true))
    .then(setNewAppointment({
      appointmentDate: "",
      doctor: "",
      animal: ""
    }))
  }

  const handleUpdateInput = (e) => {
    const {id} = e.target
    setIsUpdating(true)
    setUpdateAppointment(appointments.find((appointment) => appointment.id == id))
  }

  const handleUpdateAppointmentInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateAppointment((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdateAppointmentBtn = () => {
    const {id} = updateAppointment
    axios
    .put(import.meta.env.VITE_APP_BASEURL + `api/v1/appointments/${id}`, updateAppointment)
    .then(() => setUpdateAppointment({
      appointmentDate: "",
      doctor: "",
      animal: ""
    }))
    .then(() => setIsUpdating(false))
    .then(() => setUpdate(true))
  }

  const handleDeleteInput = (e) => {
    const {id} = e.target
    axios
    .delete(import.meta.env.VITE_APP_BASEURL + `api/v1/appointments/${id}`)
    .then(() => setUpdate(true))
  }

  const handleSearchDoctorAndDate = () => {
    const doctorId = searchByDoctorAndDateRangeDoctorRef.current.value;
    const startDate = searchByDoctorAndDateRangeDateStartRef.current.value;
    const finishDate = searchByDoctorAndDateRangeDateFinishRef.current.value;
    axios
    .get(import.meta.env.VITE_APP_BASEURL + `api/v1/appointments/searchByDoctorAndDateRange?id=${doctorId}&startDate=${startDate}&endDate=${finishDate}`)
    .then((res) => {
      setAppointments(res.data.content);
      console.log(res.data.content);
    })
  }

  const handleSearchAnimalAndDate = () => {
    const animalId = searchByAnimalAndDateRangeAnimalRef.current.value;
    const startDate = searchByAnimalAndDateRangeDateStartRef.current.value;
    const finishDate = searchByAnimalAndDateRangeDateFinishRef.current.value;

    axios
    .get(import.meta.env.VITE_APP_BASEURL + `api/v1/appointments/searchByAnimalAndDateRange?id=${animalId}&startDate=${startDate}&endDate=${finishDate}`)
    .then((res) => {
      setAppointments(res.data.content);
      console.log(res.data.content)
    } )

  }
  

  return (
  <>

    <div className='search-bar'>
      <div>
        <h3>Search by Doctor and Date Range</h3>
        <select ref={searchByDoctorAndDateRangeDoctorRef}>
          <option value="">Select Doctor</option>
          {doctors.map((doctor)=> (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
        <input 
        type="date"
        ref={searchByDoctorAndDateRangeDateStartRef}
        />
        <input 
        type="date"
        ref={searchByDoctorAndDateRangeDateFinishRef}
        />
        <button onClick={handleSearchDoctorAndDate}>Search by Doctor and Date</button>
      </div>

      <div>
        <h3>Search by Animal Name and Date Range</h3>
        <select ref={searchByAnimalAndDateRangeAnimalRef}>
          <option value="">Select Animal</option>
          {animals.map((animal)=> (
            <option key={animal.id} value={animal.id}>
              {animal.name}
            </option>
          ))}
        </select>
        <input 
        type="date"
        ref={searchByAnimalAndDateRangeDateStartRef}
        />
        <input 
        type="date"
        ref={searchByAnimalAndDateRangeDateFinishRef}
        />
        <button onClick={handleSearchAnimalAndDate}>Search by Animal and Date</button>
      </div>

    </div>


    <div className='add-and-update-bar'>

      <h2>Add New Appointmet</h2>
      <input 
      type="datetime-local"
      placeholder='date'
      name='appointmentDate'
      value={newAppointment.appointmentDate}
      onChange={handleNewAppointmentInputChange}
      />
      <select name="doctor" onChange={handleNewAppointmentDoctor}>
        <option value="">Select Doctor</option>
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.name}
          </option>
        ))}
      </select>
      <select name="animal" onChange={handleNewAppointmentAnimal}>
        <option value="">Select Animal</option>
        {animals.map((animal) => (
          <option key={animal.id} value={animal.id}>
            {animal.name}
          </option>
        ))}
      </select>
      <button onClick={handleAddNewAppointment}>Add Appointment</button>

      {isUpdating &&
      <div>
      
        <h2>Update Appointmet</h2>
        <input 
        type="datetime-local"
        placeholder='date'
        name='appointmentDate'
        value={updateAppointment.appointmentDate}
        onChange={handleUpdateAppointmentInputChange}
        />
        <select name="doctor" >
          <option value="">{updateAppointment.doctor.name}</option>
          {/* {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))} */}
        </select>
        <select name="animal" >
          <option value="">{updateAppointment.animal.name}</option>
          {/* {animals.map((animal) => (
            <option key={animal.id} value={animal.id}>
              {animal.name}
            </option>
          ))} */}
        </select>
        <button onClick={handleUpdateAppointmentBtn}>Update Appointment</button>
        
      </div>}

    </div>

    <table>
      <thead>
        <tr>
          <th>Appointment Date</th>
          <th>Doctor Name</th>
          <th>Animal Name</th>
        </tr>

      </thead>
      <tbody>
        {appointments.map((appointment, index) => (
          <tr key={index}>
            <td>{appointment.appointmentDate}</td>
            <td>{appointment.doctor.name}</td>
            <td>{appointment.animal.name}</td>
            <button id={appointment.id} onClick={handleDeleteInput}>DELETE</button>
            <button id={appointment.id} onClick={handleUpdateInput}>UPDATE</button>
            
          </tr>
        ))}

      </tbody>
    </table>
   
          

    
{/* 
    <ul>
      {appointments.map((appointment) => (
        <div key={appointment.id}>
          <li>
            {appointment.appointmentDate} - {appointment.doctor.name} - {appointment.animal.name} - 
            <span id={appointment.id} onClick={handleDeleteInput}>DELETE</span> - 
            <span id={appointment.id} onClick={handleUpdateInput}>UPDATE</span>
            </li>
        </div>          
      ))}
    </ul> */}

    
  </>
  )
}

export default BookBorrowing