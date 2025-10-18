import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

// Єдиний екземпляр axios
export const api = axios.create({
  baseURL,
  withCredentials: true, // для передачі cookies
});
