import React, { useState, useEffect } from 'react';
import './App.css'; 
import axios from './api';

const App = () => {
  const [data, setData] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: '', age: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/person/findAll'); 
      if (response.status !== 200) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = response.data;
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
      await axios.post('/person/insert', newPerson);
      fetchData(); // Refresh data after adding a new person
      setNewPerson({ name: '', age: '' }); // Clear input fields
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
            <th>Name</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.age}</td>
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
        <label>
          Age:
          <input
            type="number"
            name="age"
            value={newPerson.age}
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
