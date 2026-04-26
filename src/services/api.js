import axios from "axios";

const API = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com"
});

export const getItems = () => API.get("/posts");
export const getItem = (id) => API.get(`/posts/${id}`);
export const createItem = (data) => API.post("/posts", data);
export const updateItem = (id, data) => API.put(`/posts/${id}`, data);
export const deleteItem = (id) => API.delete(`/posts/${id}`);