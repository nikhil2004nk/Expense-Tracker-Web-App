// Simple mock auth service. Replace fetch calls with real backend later.

const TOKEN_KEY = 'auth_token'

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function login({ email, password }) {
  // Simulate network latency
  await delay(500)

  // Very basic mock logic
  const isValid = typeof email === 'string' && email.includes('@') && password?.length >= 6
  if (!isValid) {
    const error = new Error('Invalid credentials')
    error.status = 401
    throw error
  }

  const token = btoa(`${email}:${Date.now()}`)
  localStorage.setItem(TOKEN_KEY, token)
  return { token }
}

export async function register({ name, email, password }) {
  await delay(700)

  // Pretend the email must be unique
  if (email?.toLowerCase() === 'taken@example.com') {
    const error = new Error('Email already in use')
    error.status = 409
    throw error
  }

  // Return a fake success response
  return { id: Math.random().toString(36).slice(2), name, email }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated() {
  return Boolean(getToken())
}


