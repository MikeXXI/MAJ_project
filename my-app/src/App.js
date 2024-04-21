import "./App.css";
import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Form from "./components/Form";
import axios from "axios";

function App() {
  const port = process.env.REACT_APP_SERVER_PORT;
  const [users, setUsers] = useState([]);
  const [password, setPassword] = useState("");
  const [clickedIndex, setClickedIndex] = useState({});

  const getUsers = useCallback(async () => {
    try {
      const api = axios.create({
        baseURL: `http://localhost:${port}`,
      });
      const response = await api.get(`/users`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [port]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const toggleDelete = (index) => {
    setClickedIndex((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:${port}/users/${id}`, {
        data: { password: password },
      });
      getUsers();
      setPassword("");
      setClickedIndex({});
      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  return (
    <div className="App">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="App flex flex-col md:flex-row">
        <div
          className="md:w-1/2 p-4 rounded-lg shadow-lg bg-white flex flex-col justify-center items-center"
          style={{ minHeight: "100vh" }}
        >
          <Form port={port} getUsers={getUsers} />
        </div>
        <div className=" md:w-1/2 p-4 overflow-auto">
          <h2 className="text-3xl font-bold mb-7 flex items-center justify-center text-gray-800">
            GESTION DES UTILISATEURS
          </h2>
          <div className="space-y-4">
            {users.map((user, index) => (
              <div
                key={user._id}
                className="user-item mb-6 p-6 bg-white rounded-lg shadow-lg transition-shadow hover:shadow-xl"
              >
                <div className="grid grid-cols-2 gap-4">
                  <p className="font-semibold">
                    Nom: <span className="font-normal">{user.lastname}</span>
                  </p>
                  <p className="font-semibold">
                    Prénom:{" "}
                    <span className="font-normal">{user.firstname}</span>
                  </p>
                  <p className="font-semibold">
                    Email: <span className="font-normal">{user.email}</span>
                  </p>
                  <p className="font-semibold">
                    Date de naissance:{" "}
                    <span className="font-normal">
                      {formatDate(user.dateBirth)}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Ville: <span className="font-normal">{user.city}</span>
                  </p>
                  <p className="font-semibold">
                    Code postal:{" "}
                    <span className="font-normal">{user.postalCode}</span>
                  </p>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  {clickedIndex[index] ? (
                    <div className="flex items-center space-x-4">
                      <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg"
                      />
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                        onClick={() => deleteUser(user._id)}
                      >
                        Confirmer
                      </button>
                      <button
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                        onClick={() => toggleDelete(index)}
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                      onClick={() => toggleDelete(index)}
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-center text-gray-800">
                Aucun utilisateur trouvé
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
