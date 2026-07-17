const API_URL = 'http://127.0.0.1:8000'


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