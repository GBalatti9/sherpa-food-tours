import { NextRequest, NextResponse } from "next/server";
import { sendTikTokEvent, type TikTokEvent } from "@/lib/tiktok-events";
import { createHash } from "crypto";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Tally webhook payload: https://tally.so/help/webhooks
    const { eventType, data } = body;

    if (eventType !== "FORM_RESPONSE") {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Extract fields from Tally response
    const fields = data?.fields || [];
    let email = "";
    let name = "";

    for (const field of fields) {
      const label = (field.label || "").toLowerCase();
      const value = field.value || "";

      if (label.includes("email") && typeof value === "string") {
        email = value;
      }
      if (
        (label.includes("name") || label.includes("nombre")) &&
        typeof value === "string" &&
        !name
      ) {
        name = value;
      }
    }

    const tiktokEvent: TikTokEvent = {
      event: "SubmitForm",
      event_id: `tally-${data.responseId || Date.now()}`,
      context: {
        page: {
          url: data.respondentPageUrl || "",
          referrer: "",
        },
      },
      user: {
        ...(email && { email: sha256(email) }),
        ...(name && { external_id: sha256(name) }),
      },
      properties: {
        form_id: data.formId || "",
        form_name: data.formName || "",
      },
    };

    const result = await sendTikTokEvent([tiktokEvent]);

    return NextResponse.json({ ok: true, result });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
