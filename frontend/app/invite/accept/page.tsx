import React from 'react'
import InvitationPage from '@/components/invitation/InvitationPage';
import { cookies } from 'next/headers';

const page = async() => {
  const cookieStore = await cookies();
  return (
    <InvitationPage cookie={cookieStore.toString()}></InvitationPage>
  )
}

export default page