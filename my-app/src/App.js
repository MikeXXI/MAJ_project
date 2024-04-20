import "./App.css";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Form from "./components/Form";
import axios from "axios";

function App() {
  const port = process.env.REACT_APP_SERVER_PORT;
  const [users, setUsers] = useState([]);
  const [password, setPassword] = useState("");
  const [clickedIndex, setClickedIndex] = useState({});

  const handleClick = (index) => () => {
    setClickedIndex((state) => ({
      ...state, // <-- copy previous state
      [index]: !state[index], // <-- update value by index key
    }));
  };

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
      await axios.delete(`http://localhost:${port}/users/${id}`, {
        data: { password: password },
      });

      getUsers();
      setClickedIndex({});
      // Clear password input and hide it
      setPassword("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <ToastContainer />
      <Form port={port} getUsers={getUsers} />
      <h1 className="text-3xl font-bold mb-7 flex items-center justify-center text-gray-800">
        Users manager
      </h1>
      {users.map((user, index) => (
        <div key={index} className="user-item mb-4 p-4 bg-gray-100 rounded">
          <p>Nom: {user.lastname}</p>
          <p>Prénom: {user.firstname}</p>
          <p>Email: {user.email}</p>
          <p>Date de naissance: {user.dateBirth}</p>
          <p>Ville: {user.city}</p>
          <p>Code postal: {user.postalCode}</p>
          <button
            className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
            onClick={handleClick(index)}
            data-testid={`deleteButton-${index}`}
            name="delete"
          >
            Supprimer
          </button>
          {clickedIndex[index] && (
            <div className="mt-2 flex flex-col items-center">
              <input
                data-testid={`inputPassword-${index}`}
                className="w-full bg-gray-200 text-gray-700 border rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-2"
                id={`password-${index}`}
                type="password"
                required
                placeholder="Mot de passe"
                aria-label="Mot de passe"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
                onClick={() => deleteUser(user._id, index)}
                data-testid={`confirmButton-${index}`}
                name="confirm"
              >
                Confirmer
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
