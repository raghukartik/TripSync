// app/[tripId]/expenses/add/page.tsx
import { ExpenseForm } from "@/components/add-tripExpenses";

import { getUserInfo, getTripCollaborators } from "@/lib/api";
interface PageProps {
  params: {
    tripId: string;
  };
}

interface Collaborator {
  _id: string;
  name: string;
  email?: string;
}

interface User {
  _id: string;
}


export default async function AddExpensePage({ params }: PageProps) {
  const { tripId } = await params;
  const user: User = await getUserInfo();
  const data = await getUserInfo();
  if (data) {
    user._id = data._id;
  }
  const collaborators: Collaborator[] = await getTripCollaborators(tripId);
  return (
    <div className="container mx-auto py-8">
      <ExpenseForm
        tripId={tripId}
        collaborators={collaborators}
        currentUserId={user._id}
      />
    </div>
  );
}
