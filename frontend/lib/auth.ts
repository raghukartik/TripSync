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