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
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>410 - Content no longer available</title>
  <style>
    :root {
      color-scheme: light;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: #eff0e9;
      color: #1f1f1f;
      font-family: Georgia, "Times New Roman", serif;
    }

    main {
      max-width: 560px;
      width: 100%;
      padding: 40px 32px;
      background: #ffffff;
      border: 1px solid rgba(1, 126, 128, 0.14);
      box-shadow: 0 18px 48px rgba(0, 0, 0, 0.08);
      text-align: center;
    }

    h1 {
      margin: 0 0 12px;
      font-size: 40px;
      line-height: 1;
      color: #017e80;
    }

    p {
      margin: 0;
      font-size: 18px;
      line-height: 1.5;
    }

    a {
      display: inline-block;
      margin-top: 24px;
      padding: 10px 18px;
      border-radius: 4px;
      background: #e84f1a;
      color: #ffffff;
      text-decoration: none;
      transition: opacity 0.2s ease;
    }

    a:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <main>
    <h1>410 Gone</h1>
    <p>This content has been permanently removed.</p>
    <a href="https://www.sherpafoodtours.com/">Back to site</a>
  </main>
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
