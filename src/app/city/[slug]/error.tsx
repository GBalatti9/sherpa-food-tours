"use client";

import ErrorPage from "@/ui/components/error-page";

export default function CityError({ reset }: { reset: () => void }) {
    return <ErrorPage reset={reset} />;
}
