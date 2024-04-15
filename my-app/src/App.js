import "./App.css";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Form from "./components/Form";
import axios from "axios";

function App() {
  const port = process.env.REACT_APP_SERVER_PORT;
  let [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    try {
      const api = axios.create({
        baseURL: `http://localhost:${port}`,
      });
      const response = await api.get(`/users`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const deleteUser = async (id) => {
    try {
      const api = axios.create({
        baseURL: `http://localhost:${port}`,
      });
      await api.delete(`/users/${id}`);
      getUsers();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="App">
      <ToastContainer />
      <Form port={port} getUsers={() => getUsers()} />
      <h1
        data-testid="title"
        className="text-3xl font-bold mb-7 flex items-center justify-center text-gray-800
      "
      >
        Users manager
      </h1>
      <br></br>
      {users.map((user, index) => (
        <div key={index} className="user-item">
          <p>Nom: {user.lastname}</p>
          <p>Prénom: {user.firstname}</p>
          <p>Email: {user.email}</p>
          <p>Date de naissance: {user.dateBirth}</p>
          <p>Ville: {user.city}</p>
          <p>Code postal: {user.postalCode}</p>
          <br></br>
          <button
            className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-10 border-b-4 border-red-700 hover:border-red-500 rounded"
            onClick={() => deleteUser(user._id)}
            data-testid="deleteButton"
            name="delete"
          >
            Supprimer
          </button>
          <br></br>
        </div>
      ))}
    </div>
  );
}

export default App;
