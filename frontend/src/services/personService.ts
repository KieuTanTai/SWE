import axiosClient from "@/utils/axiosClient";
import { Person } from "@/interfaces";

export const personService = {
  // Get all persons
  getAllPersons: async (): Promise<Person[]> => {
    const response = await axiosClient.get('/persons');
    return response.data;
  },

  // Get person by ID
  getPersonById: async (id: number): Promise<Person> => {
    const response = await axiosClient.get(`/persons/${id}`);
    return response.data;
  },

  // Get multiple persons by IDs
  getPersonsByIds: async (ids: number[]): Promise<Person[]> => {
    if (!ids.length) return [];
    const response = await axiosClient.get('/persons/multiple', {
      params: { ids: ids.join(',') }
    });
    return response.data;
  },

  // Create person
  createPerson: async (data: Partial<Person>): Promise<Person> => {
    const response = await axiosClient.post('/persons', data);
    return response.data;
  },

  // Update person
  updatePerson: async (id: number, data: Partial<Person>): Promise<Person> => {
    const response = await axiosClient.put(`/persons/${id}`, data);
    return response.data;
  },

  // Delete person
  deletePerson: async (id: number): Promise<void> => {
    await axiosClient.delete(`/persons/${id}`);
  }
};
