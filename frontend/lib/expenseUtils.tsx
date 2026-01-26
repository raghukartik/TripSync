export const getCategoryBadgeVariant = (category: string): "default" | "secondary" | "destructive" | "outline" => {
  const lowerCategory = category.toLowerCase();
  if (['transport', 'travel'].includes(lowerCategory)) return 'secondary';
  if (['food', 'dining', 'restaurant'].includes(lowerCategory)) return 'destructive';
  if (['hotel', 'accommodation'].includes(lowerCategory)) return 'outline';
  return 'default';
};

export const getCategoryIcon = (category: string): string => {
  const lowerCategory = category.toLowerCase();
  if (['transport', 'travel'].includes(lowerCategory)) return '🚗';
  if (['food', 'dining', 'restaurant'].includes(lowerCategory)) return '🍽️';
  if (['hotel', 'accommodation'].includes(lowerCategory)) return '🏨';
  if (['entertainment', 'activity'].includes(lowerCategory)) return '🎯';
  if (['shopping'].includes(lowerCategory)) return '🛍️';
  return '💰';
};