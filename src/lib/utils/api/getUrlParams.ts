"use client";

import { Role } from "@/features/types.features";
import { useParams } from "next/navigation";

export const getUrlParams = () => {
    const { role, username } = useParams<{role: Role, username: string }>();
    return {
        role,
        username
    };
}