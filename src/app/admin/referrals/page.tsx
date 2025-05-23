'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Referral functionality removed

export default function ReferralsPage() {
  const router = useRouter();

  // Redirect to the admin homepage if someone tries to access this page directly
  useEffect(() => {
    router.push('/admin');
  }, [router]);

  // Return null or a simple message that will only show briefly before redirect
  return (
    <div className="p-8 text-center">
      <p>Redirecting to dashboard...</p>
    </div>
  );
}
