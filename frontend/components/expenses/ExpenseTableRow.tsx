import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "lucide-react"
import { format } from 'date-fns'
import { SharedWithDisplay } from './SharedWithDisplay'
import { formatAmount } from "@/lib/currencyConfig"

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

interface ExpenseTableRowProps {
  expense: Expense;
  index: number;
  getCategoryBadgeVariant: (category: string) => "default" | "secondary" | "destructive" | "outline";
  getCategoryIcon: (category: string) => string;
}

export function ExpenseTableRow({ 
  expense, 
  index, 
  getCategoryBadgeVariant, 
  getCategoryIcon 
}: ExpenseTableRowProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <TableRow 
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
        <SharedWithDisplay sharedWith={expense.sharedWith} />
      </TableCell>
      <TableCell className="text-right">
        <span className="text-lg font-bold text-gray-900">
          {formatAmount(expense.amount)}
        </span>
        {expense.sharedWith.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {formatAmount(expense.amount / (expense.sharedWith.length + 1))} per person
          </p>
        )}
      </TableCell>
    </TableRow>
  );
}