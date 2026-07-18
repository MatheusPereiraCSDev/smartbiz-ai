import type { Client } from './client'

export type TransactionType = 'receita' | 'despesa'

export interface Transaction {
  id: number
  description: string
  amount: number
  type: TransactionType
  date: string
  client_id: number | null
  client: Client | null
}

export interface ExpenseFormData {
  description: string
  amount: number
  date: string
}

export interface PurchaseFormData {
  description: string
  amount: number
  date: string
  client_id: number
}