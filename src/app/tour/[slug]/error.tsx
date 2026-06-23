"use client";

import ErrorPage from "@/ui/components/error-page";

export default function TourError({ reset }: { reset: () => void }) {
    return <ErrorPage reset={reset} />;
}
