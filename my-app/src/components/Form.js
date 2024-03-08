import React, { useState } from "react";
import {
  isValidFirstName,
  isValidLastName,
  isValidEmail,
  isValidCity,
  isValidDateBirth,
  isValidPostalCode,
} from "../utils/validations";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { calculateAge } from "../utils/calculateAge";

/**
 * Functional component representing a registration form.
 *
 * @component
 * @returns {JSX.Element} The rendered form component.
 */
export default function Form() {
  /**
   * State to manage form data and errors.
   * @type {Object}
   * @property {Object} formData - Form input values.
   * @property {Object} errors - Validation errors for form inputs.
   */
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    dateBirth: "",
    email: "",
    postalCode: "",
    city: "",
  });

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    dateBirth: "",
    email: "",
    postalCode: "",
    city: "",
  });

  /**
   * Handles input change events and updates form data and errors.
   *
   * @param {Object} e - The event object.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const errorMessage = validateInput(name, value);
    setErrors({ ...errors, [name]: errorMessage });
  };

  /**
   * Validates input based on its name.
   *
   * @param {string} name - The name of the input.
   * @param {string} value - The value of the input.
   * @returns {string} The validation error message, if any.
   */
  const validateInput = (name, value) => {
    switch (name) {
      case "firstname":
        return isValidFirstName(value);
      case "lastname":
        return isValidLastName(value);
      case "email":
        return isValidEmail(value);
      case "postalCode":
        return isValidPostalCode(value);
      case "city":
        return isValidCity(value);
      case "dateBirth":
        return isValidDateBirth(value);
      default:
        return "";
    }
  };

  /**
   * Handles form submission, validates inputs, and saves data if valid.
   */
  const handleSave = () => {
    const formErrors = {};
    Object.keys(formData).forEach((name) => {
      const errorMessage = validateInput(name, formData[name]);
      formErrors[name] = errorMessage;
    });

    setErrors(formErrors);

    const age = calculateAge({ birth: formData.dateBirth });
    const isAdult = age > 18;

    if (isAdult && Object.values(formErrors).every((error) => !error)) {
      localStorage.setItem("userData", JSON.stringify(formData));
      toast.success("Inscription réussie !");
      setFormData({
        firstname: "",
        lastname: "",
        dateBirth: "",
        email: "",
        postalCode: "",
        city: "",
      });
    } else {
      if (!isAdult) {
        toast.error("Vous devez être majeur pour vous inscrire.", {
          autoClose: 5000,
        });
      } else {
        toast.error("Veuillez remplir correctement les champs.");
      }
    }
  };

  /**
   * Renders the form component.
   *
   * @returns {JSX.Element} The rendered form component.
   */

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        data-testid="form"
        className="w-full max-w-lg"
        title="form"
        description="form"
      >
        <h2
          className="text-3xl font-bold mb-7 flex items-center justify-center text-gray-800
      "
        >
          FORMULAIRE D'INSCRIPTION
        </h2>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div
            data-testid="divPrenom"
            className="w-full md:w-1/2 px-3 mb-6 md:mb-0"
          >
            <label
              data-testid="labelPrenom"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="firstname"
            >
              Prénom*
            </label>

            <input
              data-testid="inputFirstname"
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                errors.firstname ? "border-red-500" : "border-gray-200"
              } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              id="firstname"
              type="text"
              required
              placeholder="John"
              aria-label="Prénom"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
            />
            <p>
              <span
                data-testid="errorFirstname"
                className="text-red-500 text-xs italic"
              >
                {errors.firstname}
              </span>
            </p>
          </div>

          <div
            className="w-full md:w-1/2 px-3 mb-6 md:mb-0"
            data-testid="divNom"
          >
            <label
              data-testid="labelLastname"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="lastname"
            >
              Nom*
            </label>
            <input
              data-testid="inputLastname"
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                errors.lastname ? "border-red-500" : "border-gray-200"
              } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              id="lastname"
              type="text"
              aria-label="Nom"
              placeholder="Doe"
              required
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
            />
            <p>
              <span
                data-testid="errorLastname"
                className="text-red-500 text-xs italic"
              >
                {errors.lastname}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div data-testid="divEmail" className="w-full px-3">
            <label
              data-testid="labelEmail"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="email"
            >
              Email*
            </label>
            <input
              data-testid="inputEmail"
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              id="email"
              type="email"
              aria-label="Email"
              placeholder="John.doe@gmail.com"
              required
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <p>
              <span
                data-testid="errorEmail"
                className="text-red-500 text-xs italic"
              >
                {errors.email}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3" data-testid="divDate">
            <label
              data-testid="labelDate"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="dob"
            >
              Date de naissance* (18 ans et plus)
            </label>
            <input
              data-testid="inputDate"
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                errors.dateBirth ? "border-red-500" : "border-gray-200"
              } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              id="dob"
              aria-label="Date de naissance"
              type="date"
              required
              name="dateBirth"
              value={formData.dateBirth}
              onChange={handleInputChange}
            />
            <p>
              <span
                data-testid="errorDate"
                className="text-red-500 text-xs italic"
              >
                {errors.dateBirth}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div
            className="w-full md:w-2/4 px-3 mb-6 md:mb-0"
            data-testid="divCity"
          >
            <label
              data-testid="labelCity"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="city"
            >
              Ville*
            </label>
            <input
              data-testid="inputCity"
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                errors.city ? "border-red-500" : "border-gray-200"
              } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              id="city"
              type="text"
              aria-label="Ville"
              placeholder="Antibes"
              required
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
            <p>
              <span
                data-testid="errorCity"
                className="text-red-500 text-xs italic"
              >
                {errors.city}
              </span>
            </p>
          </div>

          <div
            className="w-full md:w-2/4 px-3 mb-6 md:mb-0"
            data-testid="divZip"
          >
            <label
              data-testid="labelZip"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="zip"
            >
              Code postale*
            </label>
            <input
              data-testid="inputZip"
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                errors.postalCode ? "border-red-500" : "border-gray-200"
              } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              id="zip"
              type="text"
              placeholder="06600"
              aria-label="Code postale"
              required
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
            />
            <p>
              <span
                data-testid="errorZip"
                className="text-red-500 text-xs italic"
              >
                {errors.postalCode}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-10 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            onClick={handleSave}
            data-testid="saveButton"
            name="validate"
            disabled={
              !formData.firstname ||
              !formData.lastname ||
              !formData.dateBirth ||
              !formData.email ||
              !formData.postalCode ||
              !formData.city ||
              Object.values(errors).some((error) => error !== "")
            }
            style={{
              cursor:
                formData.firstname &&
                formData.lastname &&
                formData.dateBirth &&
                formData.email &&
                formData.postalCode &&
                formData.city &&
                !Object.values(errors).some((error) => error !== "")
                  ? "pointer"
                  : "not-allowed",
              opacity:
                formData.firstname &&
                formData.lastname &&
                formData.dateBirth &&
                formData.email &&
                formData.postalCode &&
                formData.city &&
                !Object.values(errors).some((error) => error !== "")
                  ? 1
                  : 0.5,
            }}
          >
            Sauvegarder
          </button>
        </div>
        <div
          data-testid="errorButton"
          className="flex items-center justify-center mt-0"
        >
          {Object.values(errors).some((error) => error !== "") && (
            <p className="text-red-500 text-xs italic">
              Veuillez remplir correctement les champs.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
