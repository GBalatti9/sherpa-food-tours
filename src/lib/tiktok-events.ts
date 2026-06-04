const TIKTOK_API_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/";
const PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID!;
const ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN!;

export type TikTokEvent = {
  event: string;
  event_id: string;
  timestamp?: string;
  context?: {
    user_agent?: string;
    ip?: string;
    page?: {
      url?: string;
      referrer?: string;
    };
  };
  user?: {
    email?: string;
    phone?: string;
    external_id?: string;
  };
  properties?: Record<string, unknown>;
};

export async function sendTikTokEvent(events: TikTokEvent[]) {
  if (!ACCESS_TOKEN || !PIXEL_ID) {
    console.warn("[TikTok S2S] Missing TIKTOK_ACCESS_TOKEN or PIXEL_ID");
    return null;
  }

  const payload = {
    pixel_code: PIXEL_ID,
    partner_name: "Sherpa Food Tours",
    event_source: "web",
    event_source_id: PIXEL_ID,
    data: events.map((e) => ({
      event: e.event,
      event_id: e.event_id,
      event_time: e.timestamp
        ? Math.floor(new Date(e.timestamp).getTime() / 1000)
        : Math.floor(Date.now() / 1000),
      user: {
        ...(e.context?.user_agent && { user_agent: e.context.user_agent }),
        ...(e.context?.ip && { ip: e.context.ip }),
        ...(e.user?.email && { email: e.user.email }),
        ...(e.user?.phone && { phone_number: e.user.phone }),
        ...(e.user?.external_id && { external_id: e.user.external_id }),
      },
      page: {
        url: e.context?.page?.url || "",
        referrer: e.context?.page?.referrer || "",
      },
      properties: e.properties || {},
    })),
  };

  try {
    const res = await fetch(TIKTOK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.code !== 0) {
      console.error("[TikTok S2S] API error:", data.message);
    }

    return data;
  } catch (err) {
    console.error("[TikTok S2S] Request failed:", err);
    return null;
  }
}
