"use server";
import { cookies } from "next/headers";
export async function getUserInfo(){
  try {
    const cookieStore = await cookies();
    const res = await fetch('http://localhost:8000/api/user/me', {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("User info fetch failed:", res.status);
      throw new Error("failed to fetch user info");
    }

    const data = await res.json();
    return data.user;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

export async function getAllUserTrips(){
  try{
    const cookieStore = await cookies();
    const res = await fetch('http://localhost:8000/api/user/all-trips', {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if(!res.ok) throw new Error("failed to fetch all trips");
    const data = await res.json();
    return data.data;
  }catch(error){
    console.error("Error fetching user's all trips:", error);
    return null;
  }
}

export async function getUserUpcomingTrips(){
  try{
    const cookieStore = await cookies();
    const res = await fetch('http://localhost:8000/api/user/upcoming-trips-dashboard', {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if(!res.ok) throw new Error("failed to fetch upcoming trips");
    const data = await res.json();
    return data.data;
  }catch(error){
    console.error("Error fetching user's upcoming trips:", error);
    return null;
  }
}

export async function getUserCompletedTrips(){
  try{
    const cookieStore = await cookies();
    const res = await fetch('http://localhost:8000/api/user/completed-trips-dashboard', {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if(!res.ok) throw new Error("failed to fetch user's completed trips");
    const data = await res.json();
    return data.data;
  }catch(error){
    console.error("Error fetching user's completed trips:", error);
    return null;
  }
}


export async function getRoomCollab(tripId: string){
  const cookieStore = await cookies();
  const res = await fetch(`http://localhost:8000/api/trips/tripRooms/${tripId}/collaborators`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    next: { tags: ['messages'] },
  });
  if(!res.ok) return null;
  const data = await res.json();
  return data.collaborators;
}