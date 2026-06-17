const API_URL = "http://127.0.0.1:5000/api"


//-- Registro --//
export const registerUser = async (data) => {
    const result = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    })
    return await result.json()
}

//-- Auth ---- //
export const loginUser = async (data) => {
    const result = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    })
    return await result.json() 
};