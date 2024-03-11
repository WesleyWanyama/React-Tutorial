import React, { useState, useEffect } from 'react';
import './App.css'; 
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [newPerson, setNewPerson] = useState({name: ''});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/person'); 
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewPerson({ ...newPerson, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/v1/person', newPerson);
      fetchData(); // Refresh data after adding a new person
      setNewPerson({ name: '' }); // Clear input fields
    } catch (error) {
      console.error('Error adding new person:', error);
    }
  };

  return (
    <div>
      <h1>Data of Persons</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Add New Person</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={newPerson.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Add Person</button>
      </form>
    </div>
  );
};

export default App;