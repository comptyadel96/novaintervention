"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const ALLOWED_PREFIXES = ["/dashboard/complete-profile"];

export function ProfileCompletionRedirect({
  needsCompletion,
}: {
  needsCompletion: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const allowed = ALLOWED_PREFIXES.some((p) => pathname.startsWith(p));

    if (needsCompletion && !allowed) {
      router.replace("/dashboard/complete-profile");
      return;
    }

    if (!needsCompletion && pathname.startsWith("/dashboard/complete-profile")) {
      router.replace("/dashboard");
    }
  }, [needsCompletion, pathname, router]);

  return null;
}
