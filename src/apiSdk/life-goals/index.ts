import axios from 'axios';
import queryString from 'query-string';
import { LifeGoalInterface, LifeGoalGetQueryInterface } from 'interfaces/life-goal';
import { GetQueryInterface } from '../../interfaces';

export const getLifeGoals = async (query?: LifeGoalGetQueryInterface) => {
  const response = await axios.get(`/api/life-goals${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createLifeGoal = async (lifeGoal: LifeGoalInterface) => {
  const response = await axios.post('/api/life-goals', lifeGoal);
  return response.data;
};

export const updateLifeGoalById = async (id: string, lifeGoal: LifeGoalInterface) => {
  const response = await axios.put(`/api/life-goals/${id}`, lifeGoal);
  return response.data;
};

export const getLifeGoalById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/life-goals/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteLifeGoalById = async (id: string) => {
  const response = await axios.delete(`/api/life-goals/${id}`);
  return response.data;
};
