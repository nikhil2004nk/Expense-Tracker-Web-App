# Backend Authentication Requirements (Aligned With Current Frontend)

This spec is derived from the existing frontend code in `src/services/auth.js`, `src/pages/auth/Login.jsx`, `src/pages/auth/Register.jsx`, and `src/routes/RequireAuth.jsx`.

## Findings From Frontend
- **Login flow**: `login({ email, password })` expects a successful response containing a `token` and stores it in `localStorage` under key `auth_token`. After success, UI navigates to `/dashboard`.
- **Register flow**: `register({ name, email, password })` expects a success response with a newly created user object `{ id, name, email }`. It does not auto-login; UI shows success then redirects to `/login`.
- **Auth guard**: `RequireAuth.jsx` checks `localStorage.getItem('auth_token')`. No backend validation call is made during route guarding.
- **Current token usage in API calls**: No existing fetch/axios calls send `Authorization` yet. All data features are mocked locally. Plan for `Authorization: Bearer <token>` once real APIs are wired.

## Storage & Token Expectations
- **Local storage key**: `auth_token`.
- **Token format**: Can be opaque or JWT. Prefer JWT for stateless APIs.
- **Frontend behavior**:
  - On login success: expects `{ token: string }`.
  - On register success: expects `{ id: string, name: string, email: string }`.
  - On errors: the UI surfaces `err.message`. Include a clear `message` string in error responses.

## Endpoint Specifications

### POST /api/auth/register
- **Purpose**: Create a new user account.
- **Request (JSON)**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "<min 6 chars>"
}
```
- **Validations**:
  - `name`: required, string, min length 2.
  - `email`: required, valid email, unique.
  - `password`: required, string, min length 6.
- **Responses**:
  - 201 Created
```json
{
  "id": "user_abc123",
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```
  - 409 Conflict (email exists)
```json
{ "message": "Email already in use" }
```
  - 400 Bad Request (validation)
```json
{ "message": "Validation error", "errors": { "field": "reason" } }
```

### POST /api/auth/login
- **Purpose**: Authenticate a user and return a token that the frontend stores as `auth_token`.
- **Request (JSON)**:
```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```
- **Validations**:
  - `email` must be a valid email.
  - `password` min length 6.
- **Responses**:
  - 200 OK
```json
{ "token": "<jwt-or-opaque-token>" }
```
  - 401 Unauthorized (invalid credentials)
```json
{ "message": "Invalid credentials" }
```
  - 400 Bad Request (validation)
```json
{ "message": "Validation error", "errors": { "field": "reason" } }
```

### GET /api/auth/me (optional but recommended)
- **Purpose**: Return the authenticated user's minimal profile for UI personalization if needed later.
- **Auth**: `Authorization: Bearer <token>`
- **Responses**:
  - 200 OK
```json
{ "id": "user_abc123", "name": "Jane Doe", "email": "jane@example.com" }
```
  - 401 Unauthorized
```json
{ "message": "Unauthorized" }
```

### POST /api/auth/logout (optional)
- Stateless JWT setups typically do not need server logout. Provide this only if you maintain server-side sessions/blacklists.
- **Responses**:
  - 204 No Content

## Error Response Shape (General)
- Use a consistent shape the UI can show directly via `err.message`:
```json
{ "message": "Human-friendly error" }
```
- For validation errors, include a field map when helpful:
```json
{ "message": "Validation error", "errors": { "email": "Invalid email" } }
```

## Security Requirements
- **Password hashing**: Hash with bcrypt/argon2. Never store plaintext.
- **JWT** (if used):
  - Sign with strong secret (HS256) or key pair (RS256).
  - Include standard claims: `sub` (user id), `iat`, `exp`.
  - Reasonable expiry (e.g., 1–12h). Frontend currently has no refresh flow; prefer moderate expiry until refresh is built.
- **Refresh tokens** (future): Not currently required by frontend. Add a refresh flow only when the UI supports it.
- **Brute-force protection**: Rate limit `/api/auth/login`.
- **CORS**: Allow the frontend origin and `Authorization` header.
- **Input validation**: Server-side validations mirroring frontend Zod rules.

## CORS Example
- Allow methods: `POST, GET, OPTIONS`.
- Allow headers: `Content-Type, Authorization`.
- Credentials: false (no cookies used by current UI).

## Example Integration Notes (Frontend Changes When Wiring Real API)
- Replace mock functions in `src/services/auth.js` with real `fetch`/`axios` calls.
- On login success, set `localStorage.setItem('auth_token', token)` (unchanged).
- For any protected API calls you add later (e.g., transactions), send `Authorization: Bearer ${localStorage.getItem('auth_token')}`.
- `RequireAuth.jsx` currently checks only local storage. Optionally enhance later to validate token (e.g., ping `/api/auth/me`) if you want server-validated protection.

## Minimal Happy Path Summary
- Register: Client sends `{ name, email, password }` → Server returns `{ id, name, email }` (201).
- Login: Client sends `{ email, password }` → Server returns `{ token }` (200) → Client stores under `auth_token` and navigates to `/dashboard`.
- Optional: Client may call `/api/auth/me` with `Authorization: Bearer <token>` to fetch profile.
