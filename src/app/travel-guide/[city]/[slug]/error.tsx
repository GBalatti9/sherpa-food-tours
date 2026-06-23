"use client";

import ErrorPage from "@/ui/components/error-page";

export default function TravelGuideError({ reset }: { reset: () => void }) {
    return <ErrorPage reset={reset} />;
}
