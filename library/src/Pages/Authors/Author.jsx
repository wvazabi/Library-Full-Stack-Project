import axios from 'axios'
import { useState, useEffect } from 'react'

function Author() {
    const [customers, setCustomers] = useState([]);
    const [update, setUpdate] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [search, setSearch] = useState('')
    const [newCustomer, setNewCustomer] = useState({
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
    })
  
    const [updateCustomer, setUpdateCustomer] = useState({
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
    })
      
    
  
    useEffect(() => {
      axios
      .get(import.meta.env.VITE_APP_BASEURL + "api/v1/customers")
      .then((res) => setCustomers(res.data.content))
      .then(() => setUpdate(false))
    }, [update])
  
    const handleNewCustomerInputChange = (e) => {
      const { name, value} = e.target;
      setNewCustomer((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  
    const handleAddNewCustomer = () => {
      axios.post(import.meta.env.VITE_APP_BASEURL + "api/v1/customers", newCustomer)
      // .then((res) => console.log(res))
      .then(() => setUpdate(true) )
      .then(setNewCustomer({
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
      .delete(import.meta.env.VITE_APP_BASEURL + `api/v1/customers/${id}`)
      .then(() => setUpdate(true))
    }
  
    const handleUpdateInput = (e) => {
      const id = e.target.id;
      setIsUpdating(true)
      setUpdateCustomer(customers.find((cust) => cust.id == id))
    }
  
    const handleUpdateCustomerInputChange = (e) => {
      const  { name, value  }= e.target
      setUpdateCustomer((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  
    const handleUpdateCustomerBtn = (e) => {
      const { id } = updateCustomer
      axios
      .put(`${import.meta.env.VITE_APP_BASEURL}api/v1/customers/${id}`, updateCustomer)
      .then(() => setUpdate(true))
      .then(() => setUpdateCustomer({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: ""
      }))
      .then(() => setIsUpdating(false))
    }
    
  
  
    return (
      <>
        <h3>Search Customer</h3>
        <input 
        type="text"
        placeholder='Search Customer'
        onChange={(e) => setSearch(e.target.value)}
        />
        
     
        <div className='add-and-update-bar'>
          <div>
          <h2>Add New Customer</h2>
          </div>
          <input 
          type="text"
          placeholder='Name'
          name='name'
          value={newCustomer.name}
          onChange={handleNewCustomerInputChange}
          />
          <input 
          type="text"
          placeholder='phone'
          name='phone'
          value={newCustomer.phone}
          onChange={handleNewCustomerInputChange}
          />
          <input 
          type="text"
          placeholder='email'
          name='email'
          value={newCustomer.email}
          onChange={handleNewCustomerInputChange}
          />
          <input 
          type="text"
          placeholder='address'
          name='address'
          value={newCustomer.address}
          onChange={handleNewCustomerInputChange}
          />
          <input 
          type="text"
          placeholder='city'
          name='city'
          value={newCustomer.city}
          onChange={handleNewCustomerInputChange}
          />
          <button onClick={handleAddNewCustomer}> Add Customer</button>
          
    
        
          {isUpdating &&
          <div>
          
            <div>
              <h2>Update Customer</h2>
            </div>
            <input 
            type="text"
            placeholder='Name'
            name='name'
            value={updateCustomer.name}
            onChange={handleUpdateCustomerInputChange}
            />
            <input 
            type="text"
            placeholder='phone'
            name='phone'
            value={updateCustomer.phone}
            onChange={handleUpdateCustomerInputChange}
            />
            <input 
            type="text"
            placeholder='email'
            name='email'
            value={updateCustomer.email}
            onChange={handleUpdateCustomerInputChange}
            />
            <input 
            type="text"
            placeholder='address'
            name='address'
            value={updateCustomer.address}
            onChange={handleUpdateCustomerInputChange}
            />
            <input 
            type="text"
            placeholder='city'
            name='city'
            value={updateCustomer.city}
            onChange={handleUpdateCustomerInputChange}
            />
            <button onClick={handleUpdateCustomerBtn}> Update Customer</button>
          </div>
          }

        </div>

        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Customer Phone</th>
              <th>Customer Email</th>
              <th>Customer Address</th>
              <th>Customer City</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{customer.address}</td>
                <td>{customer.city}</td>
                <button id={customer.id} onClick={handleDeleteInput}>DELETE</button>
                <button id={customer.id} onClick={handleUpdateInput}>UPDATE</button>
              </tr>
            ))}
            

          </tbody>
        </table>
        
      
  
        {/* {customers?.filter((customer) => {
          return search.toLocaleLowerCase() === '' ? customer : customer.name.toLocaleLowerCase().includes(search)
        })
        .map((customer) => (
          <div key={customer.id}>
            <li>
              {customer.name} - {customer.phone} -{customer.email} - {customer.address} - {customer.city} - 
              <span id={customer.id} onClick={handleDeleteInput}>DELETE</span> - 
              <span id={customer.id} onClick={handleUpdateInput}>UPDATE</span>
            </li>
  
          </div>
        ))
        
        } */}
      </>
    )
}

export default Author;