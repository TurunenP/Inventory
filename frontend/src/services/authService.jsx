import axios from "axios";
import { toast } from "react-toastify";


// export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";


export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/users/register`,
      userData,
      { withCredentials: true }
    );
    if (response.statusText === "OK") {
      toast.success("User Registered successfully");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message || error.toString()
    console.error("Error during login:", message);
    toast.error(message || "An error occurred during login.");
  }
}

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/users/login`,
      userData,
      { withCredentials: true }
    );
    if (response.statusText === "OK") {
      toast.success("Login succesful...");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message || error.toString()
    toast.error(message);

  }
}