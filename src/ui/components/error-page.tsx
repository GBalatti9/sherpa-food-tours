"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
            <h1 className="text-6xl font-bold">Oops!</h1>
            <p className="text-xl text-gray-600">
                We&apos;re having trouble loading this page
            </p>
            <p className="text-gray-500">
                This is a temporary issue. Please try again in a moment.
            </p>
            <div className="mt-2 flex gap-4">
                <button
                    onClick={reset}
                    className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80"
                >
                    Try again
                </button>
                <Link
                    href="/"
                    className="rounded-full border border-black px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-80"
                >
                    Back to home
                </Link>
            </div>
        </div>
    );
}
