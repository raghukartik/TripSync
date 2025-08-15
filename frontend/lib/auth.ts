// Update the import path below if your auth module is located elsewhere
import { auth } from "./auth"; // Adjust the path as needed to point to your auth module

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}