import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE || 'https://vague-elora-grimaldi-e16f442b.koyeb.app';
export default axios.create({ baseURL: API_BASE });
