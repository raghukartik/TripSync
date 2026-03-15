import { getExpenses } from '@/lib/api';
import ExpenseList from '@/components/expenses/ExpenseList';
interface User {
  _id: string;
  name: string;
  email: string;
}

interface Expense {
  _id: string;
  amount: number;
  category: string;
  spentBy: User;
  sharedWith: User[];
  note: string;
  date: string;
}

interface expenseProps {
  params: {
    tripId: string;
  },
  searchParams: {
    isCompleted? : string;
  }
}


export default async function ExpensePage({ params, searchParams }: expenseProps) {
  const paramsAwaited = await params;
  const awaitedSearchParams = await searchParams;
  const expenses: Expense[] = await getExpenses(paramsAwaited.tripId);
  const isCompleted = awaitedSearchParams.isCompleted === "true";
  return (
    <ExpenseList 
      tripId={paramsAwaited.tripId}
      initialExpenses={expenses || []}
      isCompleted={isCompleted}
    />
  )
}