// app/[tripId]/expenses/add/page.tsx
import { ExpenseForm } from "@/components/add-tripExpenses";

interface PageProps {
  params: {
    tripId: string;
  };
}

export default async function AddExpensePage({ params }: PageProps) {
  const {tripId} = await params;
  return (
    <div className="container mx-auto py-8">
      <ExpenseForm tripId={tripId} />
    </div>
  );
}