import { useState } from 'react'
import { Modal } from '../components/common'

export default function Budgets() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const budgetData = [
    { id: 1, category: 'Groceries', spent: 450, budget: 600, color: 'bg-emerald-500' },
    { id: 2, category: 'Entertainment', spent: 120, budget: 200, color: 'bg-blue-500' },
    { id: 3, category: 'Transportation', spent: 80, budget: 150, color: 'bg-yellow-500' },
    { id: 4, category: 'Dining Out', spent: 300, budget: 250, color: 'bg-red-500' },
  ]

  const getProgressPercentage = (spent, budget) => Math.min((spent / budget) * 100, 100)
  const getProgressColor = (spent, budget) => {
    const percentage = getProgressPercentage(spent, budget)
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-emerald-500'
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Budgets</h1>
          <p className="text-sm text-gray-500 mt-1">Track your spending against budget limits</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Budget
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {budgetData.map((budget) => {
          const percentage = getProgressPercentage(budget.spent, budget.budget)
          const progressColor = getProgressColor(budget.spent, budget.budget)
          const isOverBudget = budget.spent > budget.budget

          return (
            <div key={budget.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">{budget.category}</h3>
                {isOverBudget && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Over Budget
                  </span>
                )}
              </div>
              
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-semibold text-gray-900">
                  ${budget.spent.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">
                  / ${budget.budget.toLocaleString()}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{percentage.toFixed(0)}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${progressColor} transition-all duration-300`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {isOverBudget ? (
                    <span className="text-red-600">
                      ${(budget.spent - budget.budget).toLocaleString()} over
                    </span>
                  ) : (
                    <span className="text-emerald-600">
                      ${(budget.budget - budget.spent).toLocaleString()} left
                    </span>
                  )}
                </span>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Edit
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Budget"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              id="category"
              type="text"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., Groceries, Entertainment"
            />
          </div>
          <div>
            <label htmlFor="budgetAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Budget Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="budgetAmount"
                type="number"
                className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Create Budget
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


