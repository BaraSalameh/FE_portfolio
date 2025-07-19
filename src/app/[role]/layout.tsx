'use client'

import { Container } from "@/components/shared/Container";
import { Role } from "@/features/types.features";
import { useAppSelector } from "@/lib/store/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OwnerLayout({children}: Readonly<{children: React.ReactNode;}>) {

    const router = useRouter();
    const { username, role } = useParams<{ username: string; role: Role }>();
    const { user } = useAppSelector(state => state.profile);
    
    useEffect(() => {
        if(role === 'owner' && user?.username && user?.username !== username){
            router.replace(`/owner/${user.username}/dashboard`);
        }
    }, [user?.username]);

    return (
        <Container>
            {children}
        </Container>
    );
};