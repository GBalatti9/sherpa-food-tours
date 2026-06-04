export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function sendServerEvent(
  event: string,
  eventId: string,
  properties?: Record<string, unknown>
) {
  const payload = {
    event,
    event_id: eventId,
    page_url: window.location.href,
    page_referrer: document.referrer,
    properties,
  };

  // Fire-and-forget using sendBeacon for reliability (works even on page unload)
  const blob = new Blob([JSON.stringify(payload)], {
    type: "application/json",
  });
  const sent = navigator.sendBeacon("/api/tiktok-events", blob);

  // Fallback to fetch if sendBeacon fails
  if (!sent) {
    fetch("/api/tiktok-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }
}
