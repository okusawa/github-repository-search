"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { parseReturnPath } from "@/lib/search-params";

type BackToSearchLinkProps = {
  className?: string;
};

export function BackToSearchLink({ className }: BackToSearchLinkProps) {
  const searchParams = useSearchParams();
  const href = parseReturnPath(searchParams.get("from") ?? undefined);

  return (
    <Link href={href} className={className}>
      ← Back to search
    </Link>
  );
}
