import { NextRequest, NextResponse } from "next/server";
import { formatPostFromEmbed, filterValidPosts } from "@/app/utils/formatPostWithEmbed";

const apiUrl = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2`;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const cityId = searchParams.get("cityId");
  const search = searchParams.get("search");
  const categoryId = searchParams.get("categoryId");
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  try {
    let posts;

    if (cityId) {
      // Fetch posts by city: get city's post IDs, then fetch those posts with _embed
      const cityRes = await fetch(`${apiUrl}/cities/${cityId}`, { next: { revalidate: 3600 } });
      if (!cityRes.ok) return NextResponse.json({ ok: true, data: [] });

      const cityData = await cityRes.json();
      const postIds: number[] = (cityData.posts || []).map((p: { id: number }) => p.id);

      if (postIds.length === 0) return NextResponse.json({ ok: true, data: [] });

      const postsRes = await fetch(
        `${apiUrl}/posts?include=${postIds.join(",")}&_embed&per_page=100`,
        { next: { revalidate: 3600 } }
      );
      if (!postsRes.ok) return NextResponse.json({ ok: true, data: [] });

      const rawPosts = await postsRes.json();
      // Re-order by original ID order
      const ordered = postIds.map((id) => rawPosts.find((p: { id: number }) => p.id === id)).filter(Boolean);
      posts = ordered.map(formatPostFromEmbed);
    } else if (search && search.trim()) {
      // Search posts
      const searchRes = await fetch(
        `${apiUrl}/posts?search=${encodeURIComponent(search)}&_embed&per_page=100`,
        { next: { revalidate: 600 } }
      );
      if (!searchRes.ok) return NextResponse.json({ ok: true, data: [] });

      const rawPosts = await searchRes.json();
      posts = rawPosts.map(formatPostFromEmbed);
    } else if (categoryId) {
      // Filter by category
      const catRes = await fetch(
        `${apiUrl}/posts?categories=${categoryId}&_embed&per_page=100`,
        { next: { revalidate: 3600 } }
      );
      if (!catRes.ok) return NextResponse.json({ ok: true, data: [] });

      const rawPosts = await catRes.json();
      posts = rawPosts.map(formatPostFromEmbed);
    } else {
      // Default: paginated posts
      const postsRes = await fetch(
        `${apiUrl}/posts?per_page=${limit}&page=${page}&_embed`,
        { next: { revalidate: 3600 } }
      );
      if (!postsRes.ok) return NextResponse.json({ ok: true, data: [] });

      const rawPosts = await postsRes.json();
      posts = rawPosts.map(formatPostFromEmbed);
    }

    // Apply combined filters if needed
    let filtered = filterValidPosts(posts);

    // If we fetched by city and also have search, filter locally
    if (cityId && search && search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((post) => {
        const title = post.title.rendered.replace(/<[^>]*>/g, "").toLowerCase();
        const excerpt = post.excerpt.rendered.replace(/<[^>]*>/g, "").toLowerCase();
        return title.includes(searchLower) || excerpt.includes(searchLower);
      });
    }

    // If we fetched by category and also have city filter
    if (categoryId && cityId) {
      const cid = Number(cityId);
      filtered = filtered.filter(
        (post) =>
          post.relaciones?.ciudades?.some((c) => c?.id === cid) ?? false
      );
    }

    // If we fetched by category and also have search
    if (categoryId && search && search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((post) => {
        const title = post.title.rendered.replace(/<[^>]*>/g, "").toLowerCase();
        const excerpt = post.excerpt.rendered.replace(/<[^>]*>/g, "").toLowerCase();
        return title.includes(searchLower) || excerpt.includes(searchLower);
      });
    }

    return NextResponse.json({ ok: true, data: filtered });
  } catch (error) {
    console.error("Travel guide API error:", error);
    return NextResponse.json({ ok: false, data: [] }, { status: 500 });
  }
}
