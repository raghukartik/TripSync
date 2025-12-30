'use client';

import React from 'react'
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const InvitationPage = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  useEffect(() => {
    const validateInvitation = async() => {
      try{

        const res = await fetch(`http://localhost:8000/api/trips/invitations/validate?token=${token}`, {
          credentials: "include"
        })
        const data = res.json();
        if(!data.valid){
          router.replace("/invite/invalid");
          return;
        }
  
        if(!data.accountExists){
          router.replace(`signup?invite=${token}`);
          return;
        }
  
        if(!data.isAuthenticated) {
          router.replace(`/login?invite=${token}`);
          return;
        }
  
        router.replace(`/invite/confirm?token=${token}`);

      }catch(error){
        console.error(err);
        router.replace("/invite/invalid");
      }

      validateInvitation();
    }
  }, [token, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-gray-600">Validating invitation…</p>
    </div>
  )
}

export default InvitationPage