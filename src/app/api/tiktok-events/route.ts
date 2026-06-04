import { NextRequest, NextResponse } from "next/server";
import { sendTikTokEvent, type TikTokEvent } from "@/lib/tiktok-events";

const ALLOWED_EVENTS = [
  "PageView",
  "ViewContent",
  "AddToCart",
  "SubmitForm",
  "ClickButton",
  "InitiateCheckout",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, event_id, page_url, page_referrer, properties } = body;

    if (!event || !event_id) {
      return NextResponse.json(
        { error: "Missing event or event_id" },
        { status: 400 }
      );
    }

    if (!ALLOWED_EVENTS.includes(event)) {
      return NextResponse.json(
        { error: `Event "${event}" not allowed` },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get("user-agent") || "";
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "";

    const tiktokEvent: TikTokEvent = {
      event,
      event_id,
      context: {
        user_agent: userAgent,
        ip,
        page: {
          url: page_url || "",
          referrer: page_referrer || "",
        },
      },
      properties: properties || {},
    };

    const result = await sendTikTokEvent([tiktokEvent]);

    return NextResponse.json({ success: true, result });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
