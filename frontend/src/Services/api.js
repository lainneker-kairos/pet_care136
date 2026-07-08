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

const getAuthHeaders = () => {
    const token = localStorage.getItem("TOKENJWT")
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
}

// ==========================================
// RUTA DE REESTABLECER CONTRASEÑA
// ==========================================

export const resetPassword = async (data) => {
    const result = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    })

    if (!result.ok) throw new Error("Error al restablecer la contraseña")
    return await result.json()
}

// ==========================================
// RUTAS DE AUTENTICACIÓN
// ==========================================

// Registrar nuevo usuario base (con rol 'owner')

export const registerUser = async (data) => {
    const result = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    })
    return await result.json()
};

// Autenticar e iniciar sesión
export const loginUser = async (data) => {
    const result = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    })
    return await result.json() 
};

// ==========================================
// OBTENER CUIDADORES CON FILTROS
// ==========================================
export const getPetsitters = async (filters = {}) => {
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

// ==========================================
// RUTAS PARA EL USUARIO Y PERFIL
// ==========================================

// Obtener el perfil completo del usuario logueado
export const getUserProfile = async () => {
    const response = await fetch(`${API_URL}/profile/me`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener el perfil");
    return await response.json();
};

// Actualizar el perfil del dueño (Owner)
export const updateOwnerProfile = async (data) => {
    const response = await fetch(`${API_URL}/profile/owner`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Error al actualizar el perfil");
    return await response.json();
};

// crear el perfil de cuidador (Petsitter)
export const createPetsitterProfile = async (data) => {
    const response = await fetch(`${API_URL}/profile/petsitter`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Error al crear el perfil");
    return await response.json();
};

// Actualizar el perfil del cuidador (Petsitter)
export const updatePetsitterProfile = async (data) => {
    const response = await fetch(`${API_URL}/profile/petsitter`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Error al actualizar el perfil de cuidador");
    return await response.json();
};

// ==========================================
// Obtener perfil público de un cuidador
// ==========================================

export const getPublicProfile = async (userId) => {
    const response = await fetch(`${API_URL}/profile/${userId}`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error("Error al obtener el perfil");
    return await response.json();
};

// ==========================================
// RUTAS PARA MASCOTAS (PETS)
// ==========================================

//Obtener las mascotas del dueño
export const getMyPets = async () => {
    const response = await fetch(`${API_URL}/pets`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener las mascotas");
    return await response.json();
};

// Registrar una nueva mascota
export const createPet = async (petData) => {
    const response = await fetch(`${API_URL}/pets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(petData)
    });
    if (!response.ok) throw new Error("Error al crear la mascota");
    return await response.json();
};

// Actualizar una mascota existente (PATCH)
export const updatePet = async (petId, petData) => {
    const response = await fetch(`${API_URL}/pets/${petId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(petData)
    });
    if (!response.ok) throw new Error("Error al actualizar la mascota");
    return await response.json();
};

// Eliminar una mascota (DELETE)
export const deletePet = async (petId) => {
    const response = await fetch(`${API_URL}/pets/${petId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al eliminar la mascota");
    return await response.json();
};

// ==========================================
//RUTAS PARA RESERVAS (BOOKINGS)
// ==========================================

// Obtener las reservas de un usuario (role: 'owner' o 'petsitter')
export const getUserBookings = async (role, profileId) => {
    const response = await fetch(`${API_URL}/bookings/user/${role}/${profileId}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener las reservas");
    return await response.json();
};

// Crear una nueva reserva
export const createBooking = async (bookingData) => {
    const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingData)
    });
    if (!response.ok) throw new Error("Error al crear la reserva");
    return await response.json();
};

// Cambiar estado de una reserva (cancelar)
export const updateBookingStatus = async (bookingId, newStatus) => {
    const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
    });
    
    if (!response.ok) {
        throw new Error("Error al cambiar el estado de la reserva");
    }
    
    return await response.json();
};

// ==========================================
//RUTA PARA RESEÑAS
// ==========================================
export const createReview = async (reviewData) => {
    const response = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify(reviewData)
    });

    if (!response.ok) {
        throw new Error("Error al crear la reseña");
    }

    return await response.json();
};


// Reseñas para un Petsitter
export const getPetsitterReviews = async (petsitter_id) => {
    const response = await fetch(`${API_URL}/reviews/petsitter/${petsitter_id}`, {
        method: 'GET',
        headers: {
             "Content-Type": "application/json",
        },
 });

if (!response.ok) throw new Error("Error al obtener las reseñas");
    return await response.json();
};


