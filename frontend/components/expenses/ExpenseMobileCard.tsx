import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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

interface ExpenseMobileCardProps {
  expense: Expense;
  getCategoryBadgeVariant: (category: string) => "default" | "secondary" | "destructive" | "outline";
  getCategoryIcon: (category: string) => string;
}

export function ExpenseMobileCard({ 
  expense, 
  getCategoryBadgeVariant, 
  getCategoryIcon 
}: ExpenseMobileCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
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
          <p className="text-lg font-bold text-gray-900">{formatAmount(expense.amount)}</p>
          <Badge variant={getCategoryBadgeVariant(expense.category)} className="mt-1">
            {expense.category}
          </Badge>
        </div>
      </div>
      
      <Separator className="my-3" />
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
              {getInitials(expense.spentBy.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-gray-600">Paid by <span className="font-medium text-gray-900">{expense.spentBy.name}</span></span>
        </div>
        
        {expense.sharedWith.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <SharedWithDisplay sharedWith={expense.sharedWith} compact />
          </div>
        )}
      </div>
    </Card>
  );
}