import React from 'react'

export default function Loader({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-emerald-600 ${sizeClasses[size]}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export function LoaderOverlay({ message = 'Loading...', className = '' }) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <Loader size="lg" />
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  )
}

export function LoaderCard({ message = 'Loading...', className = '' }) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-8 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <Loader size="lg" />
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  )
}
