import {NextResponse} from 'next/server';

import {getServerSession} from "next-auth/next"
import {options} from "@/app/options";

export async function GET() {
    const session = await getServerSession(options)

    console.log('API session>', session)

    return NextResponse.json({message: "ok"});
}
