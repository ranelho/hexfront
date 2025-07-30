import axios from 'axios';

const API_URL = 'http://localhost:8080/hex/api/person';

export async function getAllPersons(page = 0, size = 12, name?: string, cpf?: string) {
  const params: any = { page, size };
  if (name) params.name = name;
  if (cpf) params.cpf = cpf;
  const res = await axios.get(`${API_URL}/all`, { params });
  return res.data;
}

export async function getPerson(id: number) {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
}

export async function createPerson(data: any) {
  const res = await axios.post(`${API_URL}`, data);
  return res.data;
}

export async function updatePerson(id: number, data: any) {
  const res = await axios.patch(`${API_URL}/${id}`, data);
  return res.data;
}

export async function deletePerson(id: number) {
  await axios.delete(`${API_URL}/${id}`);
}
