"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const InvitationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      router.replace("/invite/invalid");
      return;
    }

    const validateInvitation = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/trips/invitations/validate?token=${token}`,
          {
            credentials: "include"
          }
        );

        const data = await res.json();
        console.log("Invite validation response:", data);

        if (!data.valid) {
          router.replace("/invite/invalid");
          return;
        }

        if (!data.accountExists) {
          router.replace(`/signup?invite=${token}`);
          return;
        }

        if (!data.isAuthenticated) {
          router.replace(`/login?invite=${token}`);
          return;
        }

        router.replace(`/invite/confirm?token=${token}`);
      } catch (error) {
        console.error("Invite validation error:", error);
        router.replace("/invite/invalid");
      }
    };

    validateInvitation();
  }, [token, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-gray-600">Validating invitation…</p>
    </div>
  );
};

export default InvitationPage;
