"use client"

const API_URL = "http://127.0.0.1:5000/api"

//-- Función para detectar el rol del Usuario desde el Token --//
export const getUserRoleFromToken = () => {
    try {
        if (typeof window === "undefined") {
            return null;
        }

        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            return storedRole;
        }

        const token = localStorage.getItem("TOKENJWT");
        if (!token) {
            return null;
        }

        const payloadBase64 = token.split(".")[1];
        if (!payloadBase64) {
            return null;
        }

        const normalizedBase64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
        const paddedBase64 = normalizedBase64.padEnd(Math.ceil(normalizedBase64.length / 4) * 4, "=");
        const payload = JSON.parse(atob(paddedBase64));

        return payload?.role ?? null;
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}


//-- Registro --//
export const registerUser = async (data) => {
    const result = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    })
    return await result.json()
};

//-- Auth ---- //
export const loginUser = async (data) => {
    const result = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    })
    return await result.json() 
};

// ==========================================
// by:lnkr OBTENER CUIDADORES CON FILTROS
// ==========================================

export const getPetsitters = async (filters = {}) => {
    // query parametrs dinámicamente
    const params = new URLSearchParams();

    if (filters.city) params.append("city", filters.city);
    
    const service = filters.service_type || filters.service;
    if (service) params.append("service_type", service);
    
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);
    if (filters.duration_hours) params.append("duration_hours", filters.duration_hours);
    if (filters.min_price) params.append("min_price", filters.min_price);
    if (filters.max_price) params.append("max_price", filters.max_price);

    const result = await fetch(`${API_URL}/searchpetsitters?${params.toString()}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!result.ok) {
        throw new Error("Error al obtener la lista de cuidadores");
    }

    return await result.json();
};