import { NextRequest, NextResponse } from "next/server";
import { formatPostFromEmbed } from "@/app/utils/formatPostWithEmbed";

const apiUrl = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2`;

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const authorId = searchParams.get("authorId");
    const limit = searchParams.get("limit") || "10";
    const offset = searchParams.get("offset") || "0";

    if (!authorId) {
        return NextResponse.json({ ok: false, data: [] }, { status: 400 });
    }

    try {
        const res = await fetch(
            `${apiUrl}/posts?author=${authorId}&per_page=${limit}&offset=${offset}&_embed`,
            { next: { revalidate: 0 } }
        );

        if (!res.ok) return NextResponse.json({ ok: true, data: [] });

        const rawPosts = await res.json();
        const posts = rawPosts.map(formatPostFromEmbed);

        return NextResponse.json({ ok: true, data: posts });
    } catch (error) {
        console.error("Author posts API error:", error);
        return NextResponse.json({ ok: false, data: [] }, { status: 500 });
    }
}
