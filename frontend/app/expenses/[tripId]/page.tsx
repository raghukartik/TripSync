import { cookies } from 'next/headers';
import ExpenseList from '@/components/trip-expenses'

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
  }
}

async function getExpenses(tripId: string): Promise<Expense[] | null> {
  const cookieStore = cookies();
  const res = await fetch(`http://localhost:8000/api/trips/${tripId}/expenses`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    next: { tags: ['expenses'] },
  });

  if(!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export default async function ExpensePage({ params }: expenseProps) {
  const paramsAwaited = await params;
  const expenses = await getExpenses(paramsAwaited.tripId);
  
  return (
    <ExpenseList 
      tripId={paramsAwaited.tripId}
      initialExpenses={expenses || []}
    />
  )
}