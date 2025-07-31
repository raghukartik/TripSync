// app/[tripId]/expenses/add/page.tsx
import { ExpenseForm } from "@/components/add-tripExpenses";

interface PageProps {
  params: {
    tripId: string;
  };
}

export default function AddExpensePage({ params }: PageProps) {
  return (
    <div className="container mx-auto py-8">
      <ExpenseForm tripId={params.tripId} />
    </div>
  );
}