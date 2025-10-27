import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",  // Django backend URL
  headers: { "Content-Type": "application/json" },
});

// Contracts
export const createContract = (proposalId, token) =>
  API.post("/contracts/", { proposal: proposalId }, { headers: { Authorization: `Bearer ${token}` } });

export const getContracts = (token) =>
  API.get("/contracts/", { headers: { Authorization: `Bearer ${token}` } });

// Messages
export const sendMessage = (contractId, content, token) =>
  API.post("/messages/", { contract: contractId, content }, { headers: { Authorization: `Bearer ${token}` } });

export const getMessages = (contractId, token) =>
  API.get(`/messages/?contract=${contractId}`, { headers: { Authorization: `Bearer ${token}` } });
