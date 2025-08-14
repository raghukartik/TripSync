'use client';
import { useState } from 'react'
import { useRouter } from 'next/navigation';

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
import { Input } from "@/components/ui/input"
import { 
  PlusCircle, 
  RefreshCw, 
  Search,
  Filter,
  ChevronDown,
  DollarSign,
  Users,
  Calendar,
  Receipt,
  AlertCircle,
  Wallet
} from "lucide-react"
import { format } from 'date-fns'
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const router = useRouter();

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

  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (['transport', 'travel'].includes(lowerCategory)) return '🚗';
    if (['food', 'dining', 'restaurant'].includes(lowerCategory)) return '🍽️';
    if (['hotel', 'accommodation'].includes(lowerCategory)) return '🏨';
    if (['entertainment', 'activity'].includes(lowerCategory)) return '🎯';
    if (['shopping'].includes(lowerCategory)) return '🛍️';
    return '💰';
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  // Filter and sort expenses
  const filteredAndSortedExpenses = expenses
    .filter(expense => {
      const matchesSearch = expense.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.spentBy.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || expense.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

  // Calculate summary stats
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const uniqueCategories = [...new Set(expenses.map(e => e.category))];
  const averageExpense = expenses.length > 0 ? totalAmount / expenses.length : 0;

  if (error) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-50 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={fetchExpenses} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Summary Cards */}
      {!loading && expenses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Receipt className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Wallet className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Average</p>
                  <p className="text-2xl font-bold text-gray-900">${averageExpense.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Expenses Card */}
      <Card className="w-full">
        <CardHeader className="border-b bg-gray-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Trip Expenses
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track and manage all your travel expenses
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={fetchExpenses} 
                variant="outline" 
                size="sm" 
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                size="sm" 
                onClick={() => router.push(`/expenses/add-expenses/${tripId}`)}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="h-4 w-4" />
                Add Expense
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Filters and Search */}
          {!loading && expenses.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search expenses or people..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {uniqueCategories.map(category => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {getCategoryIcon(category)} {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <ChevronDown className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Newest First</SelectItem>
                      <SelectItem value="date-asc">Oldest First</SelectItem>
                      <SelectItem value="amount-desc">Highest Amount</SelectItem>
                      <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {(searchTerm || categoryFilter !== 'all') && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Showing {filteredAndSortedExpenses.length} of {expenses.length} expenses
                  </span>
                  {(searchTerm || categoryFilter !== 'all') && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setSearchTerm('');
                        setCategoryFilter('all');
                      }}
                      className="text-xs h-6 px-2"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : filteredAndSortedExpenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-50 rounded-full">
                  <Receipt className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              {expenses.length === 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No expenses yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Start tracking your trip expenses by adding your first expense below.
                  </p>
                  <Button 
                    onClick={() => router.push(`/expenses/add-expenses/${tripId}`)}
                    className="gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add First Expense
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching expenses</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filter criteria.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('all');
                    }}
                    className="gap-2"
                  >
                    Clear Filters
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mobile-friendly cards for small screens */}
              <div className="block md:hidden space-y-3">
                {filteredAndSortedExpenses.map((expense) => (
                  <Card key={expense._id} className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getCategoryIcon(expense.category)}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{expense.note}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-600">{formatDate(expense.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${expense.amount.toFixed(2)}</p>
                        <Badge variant={getCategoryBadgeVariant(expense.category)} className="mt-1">
                          {expense.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                            {getInitials(expense.spentBy.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-gray-600">Paid by {expense.spentBy.name}</span>
                      </div>
                      
                      {expense.sharedWith.length > 0 && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Users className="h-3 w-3" />
                          <span>{expense.sharedWith.length + 1} people</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block">
                <Table>
                  <TableCaption className="text-left text-gray-600 mb-4">
                    {filteredAndSortedExpenses.length} expense{filteredAndSortedExpenses.length !== 1 ? 's' : ''} 
                    • Total: ${totalAmount.toFixed(2)}
                  </TableCaption>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Description</TableHead>
                      <TableHead className="font-semibold">Paid by</TableHead>
                      <TableHead className="font-semibold">Shared with</TableHead>
                      <TableHead className="text-right font-semibold">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedExpenses.map((expense, index) => (
                      <TableRow 
                        key={expense._id} 
                        className={`hover:bg-gray-50/50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                        }`}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(expense.date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={getCategoryBadgeVariant(expense.category)}
                            className="gap-1"
                          >
                            <span>{getCategoryIcon(expense.category)}</span>
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium text-gray-900 truncate">{expense.note}</p>
                            {expense.note.length > 30 && (
                              <p className="text-xs text-gray-500 mt-1" title={expense.note}>
                                Click to see full description
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                                {getInitials(expense.spentBy.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{expense.spentBy.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {expense.sharedWith.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-1">
                                {expense.sharedWith.slice(0, 3).map((user) => (
                                  <Avatar key={user._id} className="h-6 w-6 border-2 border-white">
                                    <AvatarFallback className="text-xs bg-green-100 text-green-700">
                                      {getInitials(user.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {expense.sharedWith.length > 3 && (
                                  <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                                    <span className="text-xs text-gray-600">+{expense.sharedWith.length - 3}</span>
                                  </div>
                                )}
                              </div>
                              <span className="text-sm text-gray-600">
                                {expense.sharedWith.length + 1} people
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 italic">Not shared</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-lg font-bold text-gray-900">
                            ${expense.amount.toFixed(2)}
                          </span>
                          {expense.sharedWith.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              ${(expense.amount / (expense.sharedWith.length + 1)).toFixed(2)} per person
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}