// Simple mock transactions API using localStorage for persistence
const STORAGE_KEY = 'et_transactions_v1'

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export async function fetchTransactions({ signal } = {}) {
  // Simulate latency
  await new Promise((r) => setTimeout(r, 300))
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
  return loadAll()
}

export async function createTransaction(data) {
  await new Promise((r) => setTimeout(r, 200))
  const current = loadAll()
  const tx = { id: generateId(), ...data }
  current.push(tx)
  saveAll(current)
  return tx
}

export async function updateTransaction(id, updates) {
  await new Promise((r) => setTimeout(r, 200))
  const current = loadAll()
  const idx = current.findIndex((t) => t.id === id)
  if (idx === -1) throw new Error('Transaction not found')
  const updated = { ...current[idx], ...updates }
  current[idx] = updated
  saveAll(current)
  return updated
}

export async function deleteTransaction(id) {
  await new Promise((r) => setTimeout(r, 150))
  const current = loadAll()
  const next = current.filter((t) => t.id !== id)
  saveAll(next)
  return { id }
}

export function seedDemoIfEmpty() {
  const current = loadAll()
  if (current.length > 0) return
  const today = new Date().toISOString().slice(0,10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10)
  const demo = [
    { id: generateId(), amount: 250, category: 'Food', date: today, notes: 'Lunch at restaurant', receiptUrl: '' },
    { id: generateId(), amount: 500, category: 'Groceries', date: today, notes: 'Weekly groceries', receiptUrl: '' },
    { id: generateId(), amount: 1200, category: 'Transport', date: yesterday, notes: 'Fuel', receiptUrl: '' },
    { id: generateId(), amount: 350, category: 'Shopping', date: yesterday, notes: 'Clothes', receiptUrl: '' },
  ]
  saveAll(demo)
}

export function uploadReceipt(file) {
  // Mock upload: return a data URL.
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = () => resolve(String(reader.result))
    reader.readAsDataURL(file)
  })
}


