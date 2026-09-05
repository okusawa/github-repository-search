"use client";

import { useRouter } from "next/navigation";

export function RetryButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className="mt-3 inline-block font-medium text-red-900 underline hover:no-underline"
    >
      Try again
    </button>
  );
}
