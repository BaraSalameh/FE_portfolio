import { dynamicFetch } from "@/lib/api/fetchClient";
import { paths } from "@/lib/pathHelper";
import { setCookies } from "@/lib/api/cookieHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    let response;
    try {
        response = await dynamicFetch({
            method: 'POST',
            url: '/Account/Logout',
            data: {},
        });

        await setCookies(response);
    } finally {
        return NextResponse.redirect(new URL(paths.root.auth.login.path(), req.url));
    }
}