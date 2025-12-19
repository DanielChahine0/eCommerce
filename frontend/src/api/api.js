let AUTH_TOKEN = null
const BASE_URL = 'http://localhost:8080'


export function setAuthToken(token) {
AUTH_TOKEN = token
}


export async function api(path, options = {}) {
const headers = { 'Content-Type': 'application/json' }
if (AUTH_TOKEN) headers.Authorization = `Bearer ${AUTH_TOKEN}`


const res = await fetch(`${BASE_URL}${path}`, {
...options,
headers,
})


if (!res.ok) throw new Error(await res.text())
return res.json()
}