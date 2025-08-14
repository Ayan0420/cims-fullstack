import api from './axios';
import { API_URL } from './config';

export const getJobs = () => api.get('/jobs');
export const getJob = (id) => api.get(`/jobs/${id}`);
export const createJob = (jobData) => api.post('/jobs', jobData);
export const updateJob = (id, jobData) => api.patch(`/jobs/${id}`, jobData);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
export const printJob = (id) => {
    const url = `${API_URL}/report-generator/job/${id}`;
    window.open(url, '_blank');
};
export const getMonthlyReport = (year, month) =>
    api.get(`/report-generator/month/${year}/${month}`);
