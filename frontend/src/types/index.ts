export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  _count?: { todos: number }
}

export type TodoStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
export type TodoPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Todo {
  id: string
  title: string
  description?: string
  status: TodoStatus
  priority: TodoPriority
  dueDate?: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface TodoStats {
  total: number
  pending: number
  inProgress: number
  completed: number
  high: number
}

export interface TodoFilters {
  status?: TodoStatus
  priority?: TodoPriority
  search?: string
  sortBy?: 'createdAt' | 'dueDate'
  order?: 'asc' | 'desc'
}
