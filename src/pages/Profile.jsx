import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '../components/ToastProvider'
import { useLocalStorage } from '../hooks/useLocalStorage'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  currency: z.string().min(1, 'Currency is required'),
  theme: z.enum(['light', 'dark', 'system'], {
    required_error: 'Please select a theme'
  })
})

// Mock API functions
const mockApi = {
  async saveProfile(data) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true, data }
  },
  
  async loadProfile() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      name: 'John Doe',
      email: 'john.doe@example.com',
      currency: 'USD',
      theme: 'light'
    }
  }
}

const currencies = [
  { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
  { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
  { value: 'GBP', label: 'GBP - British Pound', symbol: '£' },
  { value: 'CAD', label: 'CAD - Canadian Dollar', symbol: 'C$' },
  { value: 'AUD', label: 'AUD - Australian Dollar', symbol: 'A$' },
  { value: 'JPY', label: 'JPY - Japanese Yen', symbol: '¥' }
]

const themes = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' }
]

export default function Profile() {
  const { show } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Local storage for preferences
  const [storedPreferences, setStoredPreferences] = useLocalStorage('userPreferences', {
    name: '',
    email: '',
    currency: 'USD',
    theme: 'light'
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: storedPreferences
  })

  const watchedTheme = watch('theme')

  // Load profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true)
        // Try to load from API first, fallback to localStorage
        const apiData = await mockApi.loadProfile()
        const dataToUse = apiData || storedPreferences
        reset(dataToUse)
        setStoredPreferences(dataToUse)
      } catch (error) {
        console.warn('Failed to load profile from API, using local storage:', error)
        reset(storedPreferences)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [reset, storedPreferences, setStoredPreferences])

  // Apply theme changes immediately
  useEffect(() => {
    if (watchedTheme) {
      applyTheme(watchedTheme)
    }
  }, [watchedTheme])

  const applyTheme = (theme) => {
    const root = document.documentElement
    
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      setIsSaving(true)
      
      // Save to localStorage immediately
      setStoredPreferences(data)
      
      // Try to sync with backend
      try {
        await mockApi.saveProfile(data)
        show('Profile saved successfully!', { type: 'success' })
      } catch (apiError) {
        // Still show success since localStorage was updated
        show('Profile saved locally (offline mode)', { type: 'warning' })
      }
      
      reset(data) // Reset form to mark as not dirty
    } catch (error) {
      show('Failed to save profile. Please try again.', { type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    reset(storedPreferences)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile & Settings</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Manage your account preferences and settings
            </p>
          </div>

          {/* Profile Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Update your personal details and preferences
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${
                    errors.name 
                      ? 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your full name"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${
                    errors.email 
                      ? 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your email address"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Currency Field */}
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Currency *
                </label>
                <select
                  id="currency"
                  className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.currency 
                      ? 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  {...register('currency')}
                >
                  {currencies.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
                {errors.currency && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
                    {errors.currency.message}
                  </p>
                )}
              </div>

              {/* Theme Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Theme Preference *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {themes.map((theme) => (
                    <label
                      key={theme.value}
                      className={`relative flex cursor-pointer rounded-lg p-4 border-2 transition-all ${
                        watchedTheme === theme.value
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <input
                        type="radio"
                        value={theme.value}
                        className="sr-only"
                        {...register('theme')}
                      />
                      <div className="flex items-center justify-center w-full">
                        <div className="text-center">
                          <div className="text-2xl mb-2">{theme.icon}</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {theme.label}
                          </div>
                        </div>
                      </div>
                      {watchedTheme === theme.value && (
                        <div className="absolute top-2 right-2">
                          <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
                {errors.theme && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
                    {errors.theme.message}
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                {isDirty && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!isDirty || isSaving}
                  className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-sm flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Additional Settings Section */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Account Settings</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage your account security and privacy
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Change Password</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
                </div>
                <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
                  Change Password
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Export Data</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Download your transaction data</p>
                </div>
                <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
                  Export Data
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-sm font-medium text-red-600 dark:text-red-400">Delete Account</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account</p>
                </div>
                <button className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
