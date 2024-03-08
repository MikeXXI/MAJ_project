import "./App.css";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Form from "./components/Form";
import axios from "axios";
function App() {
  const port = process.env.REACT_APP_SERVER_PORT;
  let [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    async function countUsers() {
      try {
        const api = axios.create({
          baseURL: `http://localhost:${port}`,
        });
        const response = await api.get(`/users`);
        setUsersCount(response.data.utilisateurs.length);
      } catch (error) {
        console.error(error);
      }
    }
    countUsers();
  }, []);

  return (
    <div className="App">
      <h1 data-testid="title">Users manager</h1>
      <p>{usersCount} user(s) already registred</p>
      <ToastContainer />
      <Form />
    </div>
  );
}

export default App;
