import { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { LoaderCard } from '../components/common'

function currency(amount) {
  return amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [monthsData, setMonthsData] = useState([])
  const [categoriesData, setCategoriesData] = useState([])

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        setLoading(true)
        const res = await fetch('/data/summary.json')
        if (!res.ok) throw new Error('Failed to load summary data')
        const json = await res.json()
        if (!isMounted) return
        setMonthsData(json.months || [])
        setCategoriesData(json.categories || [])
      } catch (e) {
        setError(e.message || 'Error loading data')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const totals = useMemo(() => {
    const totalIncome = monthsData.reduce((sum, m) => sum + (m.income || 0), 0)
    const totalExpense = monthsData.reduce((sum, m) => sum + (m.expense || 0), 0)
    const balance = totalIncome - totalExpense
    return { totalIncome, totalExpense, balance }
  }, [monthsData])

  const categoryColors = [
    '#6366F1',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#14B8A6',
    '#F97316',
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <LoaderCard message="Loading dashboard data..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Error loading dashboard</h3>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Income</div>
          <div className="mt-2 text-xl font-semibold text-emerald-700 dark:text-emerald-400">{currency(totals.totalIncome || 0)}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Expense</div>
          <div className="mt-2 text-xl font-semibold text-rose-700 dark:text-rose-400">{currency(totals.totalExpense || 0)}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Balance</div>
          <div className={`mt-2 text-xl font-semibold ${totals.balance >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
            {currency(totals.balance || 0)}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Categories</div>
          <div className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{categoriesData.length}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Income vs Expenses (Monthly)</h2>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthsData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => currency(Number(v))} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Expense Distribution by Category</h2>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoriesData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {categoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => currency(Number(v))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}


