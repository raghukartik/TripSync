export async function getUserInfo(){
  try {
    const res = await fetch('http://localhost:8000/api/user/me', {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    })

    if(!res.ok) throw new Error("failed to fetch user info");

    const data = await res.json();
    return data.user;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

export async function getUserUpcomingTrips(){
  try{
    const res = await fetch('http://localhost:8000/api/user/upcoming-trips', {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    })

    if(!res.ok) throw new Error("failed to fetch user info");
    const data = await res.json();
    return data.upcomingTrips;
  }catch(error){
    console.error("Error fetching user's upcoming trips:", error);
    return null;
  }
}

export async function getUserCompletedTrips(){
  try{
    const res = await fetch('http://localhost:8000/api/user/completed-trips', {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    })

    if(!res.ok) throw new Error("failed to fetch user info");
    const data = await res.json();
    return data.completedTrips;
  }catch(error){
    console.error("Error fetching user's completed trips:", error);
    return null;
  }
}