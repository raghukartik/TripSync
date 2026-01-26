import { Button } from "@/components/ui/button"
import { PlusCircle, Receipt } from "lucide-react"

interface EmptyStateProps {
  hasExpenses: boolean;
  onAddExpense: () => void;
  onClearFilters: () => void;
}

export function EmptyState({ hasExpenses, onAddExpense, onClearFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-gray-50 rounded-full">
          <Receipt className="h-8 w-8 text-gray-400" />
        </div>
      </div>
      {!hasExpenses ? (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No expenses yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start tracking your trip expenses by adding your first expense below.
          </p>
          <Button onClick={onAddExpense} className="gap-2">
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
          <Button variant="outline" onClick={onClearFilters} className="gap-2">
            Clear Filters
          </Button>
        </>
      )}
    </div>
  );
}
