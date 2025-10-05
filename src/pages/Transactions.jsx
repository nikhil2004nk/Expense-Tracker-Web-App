import { useState } from 'react'
import TransactionForm from '../components/transactions/TransactionForm'
import TransactionList from '../components/transactions/TransactionList'
import { createTransaction, updateTransaction } from '../services/transactions'

export default function Transactions() {
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(payload) {
    setSaving(true)
    try {
      if (editing) {
        await updateTransaction(editing.id, payload)
        setEditing(null)
      } else {
        await createTransaction(payload)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Transactions</h1>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">{editing ? 'Edit transaction' : 'Add a transaction'}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {editing ? 'Update the transaction details below.' : 'Fill in the details to add a new transaction.'}
          </p>
        </div>
        <TransactionForm defaultValues={editing || undefined} onSubmit={handleSubmit} submitting={saving} />
      </div>

      <TransactionList onEdit={(t) => setEditing(t)} />
    </div>
  )
}


