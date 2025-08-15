// app/[tripId]/expenses/add/page.tsx
import { ExpenseForm } from "@/components/add-tripExpenses";
import { cookies } from 'next/headers';
interface PageProps {
  params: {
    tripId: string;
  };
}

interface Collaborator{
  _id: string;
  name: string;
  email?: string;
}

async function getTripCollaborators(tripId: string): Promise<Collaborator[]>{
  try {
    const cookieStore = cookies();
    const res = await fetch(`http://localhost:8000/api/trips/${tripId}/collaborators`, {
      method: "GET",
      headers: {
        Cookie: cookieStore.toString(),
      },
      next: { tags: ['trip-collaborators'] }
    })

    if(!res.ok){
      throw new Error(`Failed to fetch collaborators: ${res.statusText}`);
    }

    const data = await res.json();
    return data.collaborators || [];
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return [];
  }
}
export default async function AddExpensePage({ params }: PageProps) {
  const {tripId} = await params;
  const collaborators = await getTripCollaborators(tripId);
  return (
    <div className="container mx-auto py-8">
      <ExpenseForm tripId={tripId} collaborators={collaborators} />
    </div>
  );
}