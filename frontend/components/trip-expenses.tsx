'use client';

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCw } from "lucide-react"
import { format } from 'date-fns'
import { Badge } from "@/components/ui/badge"

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

interface PageProps {
  tripId: string;
  initialExpenses: Expense[];
}

export default function ExpenseList({ tripId, initialExpenses }: PageProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses`);
      if (!res.ok) throw new Error('Failed to fetch expenses');
      const data = await res.json();
      setExpenses(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  }

  const getCategoryBadgeVariant = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (['transport', 'travel'].includes(lowerCategory)) return 'secondary';
    if (['food', 'dining', 'restaurant'].includes(lowerCategory)) return 'destructive';
    if (['hotel', 'accommodation'].includes(lowerCategory)) return 'outline';
    return 'default';
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchExpenses} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Expenses</CardTitle>
          <p className="text-sm text-muted-foreground">
            All expenses for this trip
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchExpenses} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No expenses recorded yet</p>
            <Button className="mt-4">Add your first expense</Button>
          </div>
        ) : (
          <Table>
            <TableCaption>A list of all expenses for this trip.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Paid by</TableHead>
                <TableHead>Shared with</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell className="font-medium">
                    {formatDate(expense.date)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getCategoryBadgeVariant(expense.category)}>
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{expense.note}</TableCell>
                  <TableCell>{expense.spentBy.name}</TableCell>
                  <TableCell>
                    {expense.sharedWith.length > 0 
                      ? `${expense.sharedWith.length} people (${expense.sharedWith.map(u => u.name).join(', ')})`
                      : 'Not shared'}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${expense.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}