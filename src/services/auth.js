// Real auth service integrated with backend NestJS endpoints.

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const SESSION_KEY = 'auth_session'

async function http(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  })
  let data
  const text = await res.text()
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { message: text }
  }
  if (!res.ok) {
    const err = new Error(data?.message || 'Request failed')
    err.status = res.status
    throw err
  }
  return data
}

export async function login({ email, password }) {
  const data = await http('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
  // Backend sets httpOnly cookies on success; we mark session locally for routing.
  localStorage.setItem(SESSION_KEY, '1')
  return data // { id, email }
}

export async function register({ name, email, password }) {
  // Backend expects fullName according to RegisterDto
  const data = await http('/auth/register', {
    method: 'POST',
    body: { fullName: name, email, password },
  })
  return data // { id, email, fullName }
}

export async function me() {
  return http('/auth/me', { method: 'GET' })
}

export function logout() {
  // Best-effort server logout to clear refresh state; ignore errors
  fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
  localStorage.removeItem(SESSION_KEY)
}

export function isAuthenticated() {
  return localStorage.getItem(SESSION_KEY) === '1'
}

