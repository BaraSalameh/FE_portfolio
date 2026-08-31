'use client'

import { Role } from "@/features/types.features";
import { useAppSelector } from "@/lib/store/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { paths } from "@/lib/pathHelper";

export default function OwnerLayout({children}: Readonly<{children: React.ReactNode;}>) {

    const router = useRouter();
    const { username, role } = useParams<{ username: string; role: Role }>();
    const { user } = useAppSelector(state => state.profile);
    
    useEffect(() => {
        if(role === 'owner' && user?.username && user?.username !== username){
            router.replace(paths.root.dashboard('owner', user.username).path());
        }
    }, [role, router, user?.username, username]);

    return (
        <div className="min-h-svh bg-canvas text-ink">{children}</div>
    );
};
