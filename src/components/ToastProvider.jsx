import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import Toast, { ToastContainer } from './common/Toast'

const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const show = useCallback((message, { type = 'success', duration = 3000 } = {}) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, type }])
    if (duration > 0) setTimeout(() => remove(id), duration)
  }, [remove])

  const value = useMemo(() => ({ show, remove }), [show, remove])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => remove(t.id)}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}


