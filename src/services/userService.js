import axios from 'axios';

const LOCAL_API_URL = 'http://localhost:3001/users';
// This follows the GitHub repo structure to provide a mock API on the live link
const REMOTE_API_URL = 'https://my-json-server.typicode.com/deepthiboppana/react-schema-form-manager/users';

// Determine which API to use. We prefer Local for development, Remote for demo.
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocal ? LOCAL_API_URL : REMOTE_API_URL;

// Helper to handle localStorage fallback for the live demo
// Since my-json-server doesn't permanently save POSTs, we use localStorage to make the demo feel real.
const getDemoData = () => JSON.parse(localStorage.getItem('demo_users')) || [];
const saveDemoData = (data) => localStorage.setItem('demo_users', JSON.stringify(data));

export const getUsers = async () => {
  if (isLocal) return axios.get(API_URL);
  
  // For Live Demo: Try to get from localStorage first to show added users
  const localData = getDemoData();
  if (localData.length > 0) return { data: localData };
  
  // Otherwise fetch initial data from GitHub via My JSON Server
  const resp = await axios.get(API_URL);
  saveDemoData(resp.data);
  return resp;
};

export const createUser = async (user) => {
  if (isLocal) return axios.post(API_URL, user);
  
  const data = getDemoData();
  const newUser = { ...user, id: Date.now() };
  const updated = [...data, newUser];
  saveDemoData(updated);
  return { data: newUser };
};

export const updateUser = async (id, user) => {
  if (isLocal) return axios.put(`${API_URL}/${id}`, user);
  
  const data = getDemoData();
  const updated = data.map(u => u.id === id ? { ...u, ...user } : u);
  saveDemoData(updated);
  return { data: user };
};

export const deleteUser = async (id) => {
  if (isLocal) return axios.delete(`${API_URL}/${id}`);
  
  const data = getDemoData();
  const updated = data.filter(u => u.id !== id);
  saveDemoData(updated);
  return { data: id };
};
