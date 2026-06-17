const API_URL = "http://127.0.0.1:5000/api"

//-- Auth ---- //
export const loginUser = async (data) => {
    const result = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {"Content-Type": "application/Json"},
        body: JSON.stringify(data),
    })
    return result.json()
};