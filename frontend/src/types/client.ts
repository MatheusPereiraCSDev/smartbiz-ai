export interface Client {
  id: number
  name: string
  email: string | null
  phone: string | null
}

export interface ClientFormData {
  name: string
  email: string
  phone: string
}