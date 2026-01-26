import { Card, CardContent } from "@/components/ui/card"
import { IndianRupee, Receipt, Wallet } from "lucide-react"
import { formatAmount } from "@/lib/currencyConfig";

interface ExpenseSummaryCardsProps {
  totalAmount: number;
  expenseCount: number;
  averageExpense: number;
}

export function ExpenseSummaryCards({ 
  totalAmount, 
  expenseCount, 
  averageExpense 
}: ExpenseSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <IndianRupee className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatAmount(totalAmount)}</p>
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
              <p className="text-2xl font-bold text-gray-900">{expenseCount}</p>
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
              <p className="text-2xl font-bold text-gray-900">{formatAmount(averageExpense)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}