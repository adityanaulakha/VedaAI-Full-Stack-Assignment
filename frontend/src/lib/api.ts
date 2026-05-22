import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

export const createAssignment = async (data: any) => {
  const response = await api.post('/assignments', data);
  return response.data; // { assignmentId, jobId }
};

export const getAssignments = async () => {
  const response = await api.get('/assignments');
  return response.data;
};

export const getAssignmentById = async (id: string) => {
  const response = await api.get(`/assignments/${id}`);
  return response.data;
};

export const deleteAssignment = async (id: string) => {
  const response = await api.delete(`/assignments/${id}`);
  return response.data;
};

export const regenerateAssignment = async (id: string) => {
  const response = await api.post(`/assignments/${id}/regenerate`);
  return response.data;
};
