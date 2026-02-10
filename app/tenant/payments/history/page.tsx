"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentHistoryPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/tenant/finance/payments");
  }, [router]);

  return null;
}

