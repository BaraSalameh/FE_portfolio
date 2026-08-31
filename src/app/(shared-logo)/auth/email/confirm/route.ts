import { serverApiResponse } from '@/lib/api/server-client';
import { paths } from "@/lib/pathHelper";
import { setCookies } from "@/lib/api/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const token = req.nextUrl.searchParams.get('token');

    if (!token) return NextResponse.redirect(new URL(paths.root.auth.email.path(), req.url));

    let response;
    try {
        const query = new URLSearchParams({
            token: token
        }).toString();

        response = await serverApiResponse({
            method: 'GET',
            url: `/Account/ConfirmEmail?${query}`
        });

    } catch {
        return NextResponse.redirect(new URL(paths.root.auth.email.path(), req.url));
    }


    await setCookies(response);
    return NextResponse.redirect(new URL(paths.root.auth.login.path(), req.url));
}
