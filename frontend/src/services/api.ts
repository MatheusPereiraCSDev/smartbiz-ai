const API_URL = import.meta.env.VITE_API_URL


export async function registerUser(data: {
  name: string
  email: string
  password: string
}) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Erro ao cadastrar')
  }

  return response.json()
}

export async function loginUser(data: { email: string; password: string }) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('E-mail ou senha inválidos')
  }

  return response.json()
}

import type { Client, ClientFormData } from '../types/client'

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function getClients(token: string): Promise<Client[]> {
  const response = await fetch(`${API_URL}/clients`, {
    headers: authHeaders(token),
  })
  if (!response.ok) throw new Error('Erro ao buscar clientes')
  return response.json()
}

export async function createClient(token: string, data: ClientFormData): Promise<Client> {
  const response = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Erro ao criar cliente')
  return response.json()
}

export async function updateClient(token: string, id: number, data: ClientFormData): Promise<Client> {
  const response = await fetch(`${API_URL}/clients/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Erro ao atualizar cliente')
  return response.json()
}

export async function deleteClient(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_URL}/clients/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  if (!response.ok) throw new Error('Erro ao remover cliente')
}