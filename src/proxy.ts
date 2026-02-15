import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import deletedUrls from "../deleted-urls.json";

// Normalize path: strip trailing slash and use lowercase for consistent matching
function normalizePath(pathname: string): string {
  return pathname.replace(/\/$/, "") || "/";
}

// Build set of deleted pathnames at module load (accepts full URLs or paths)
const DELETED_PATHS = new Set<string>();
(deletedUrls as string[]).forEach((entry) => {
  const raw = (entry || "").trim();
  if (!raw) return;
  let pathname: string;
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      pathname = new URL(raw).pathname;
    } catch {
      return;
    }
  } else {
    pathname = raw.startsWith("/") ? raw : "/" + raw;
  }
  const normalized = normalizePath(pathname);
  if (normalized) {
    DELETED_PATHS.add(normalized);
    DELETED_PATHS.add(normalized + "/");
  }
});

const GONE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, nofollow">
  <title>410 - Content no longer available</title>
</head>
<body>
  <h1>410 Gone</h1>
  <p>This content has been permanently removed.</p>
</body>
</html>
`;

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const normalized = normalizePath(pathname);

  if (DELETED_PATHS.has(normalized)) {
    return new NextResponse(GONE_HTML, {
      status: 410,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return NextResponse.next();
}

export const config = {
  // Run on all paths except Next.js internals and static assets
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:webp|png|ico|svg|js|css)).*)"],
};
