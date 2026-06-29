"use client"

import { getUserRoleFromToken } from "@/Services/api";

import OwnerProfile from "@/components/PerfilOwner";
import PetsitterProfile from "@/components/PerfilCuidador";

export default function ProfilePage() {
    const role = getUserRoleFromToken();
    if (role === "owner") return <OwnerProfile />;  
    if (role === "petsitter") return <PetsitterProfile />;
    return <p> Cargando...</p>
}