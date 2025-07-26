'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Clock, MapPin, NotebookText, X, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ActivityFormData {
  title: string;
  time: string;
  location: string;
  notes: string;
}

interface EditActivityClientProps {
  tripId: string;
  itineraryId: string;
  activityId?: string;
  initialData?: ActivityFormData;
}

export default function EditActivityClient({
  tripId,
  itineraryId,
  activityId,
  initialData,
}: EditActivityClientProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ActivityFormData>({
    title: initialData?.title || '',
    time: initialData?.time || '',
    location: initialData?.location || '',
    notes: initialData?.notes || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!activityId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = isEditing
        ? `http://localhost:8000/api/trips/${tripId}/itinerary/${itineraryId}/activities/${activityId}`
        : `http://localhost:8000/api/trips/${tripId}/itinerary/${itineraryId}/activities`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} activity`);
      }

      toast.success(`Activity ${isEditing ? 'updated' : 'created'} successfully`);
      router.push(`/itinerary/${tripId}`);
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} activity`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/trips/${tripId}/itinerary/${itineraryId}/activities/${activityId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete activity');
      }

      toast.success('Activity deleted successfully');
      router.push(`/itinerary/${tripId}`);
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete activity');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Activity' : 'Add New Activity'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Activity Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="E.g. Visit Eiffel Tower"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="time">
              <Clock className="inline mr-2 h-4 w-4" />
              Time
            </Label>
            <Input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">
            <MapPin className="inline mr-2 h-4 w-4" />
            Location
          </Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="E.g. 123 Main Street, Paris"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">
            <NotebookText className="inline mr-2 h-4 w-4" />
            Notes
          </Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional details..."
            rows={4}
          />
        </div>

        <div className="flex justify-between pt-4">
          <div>
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/itinerary/${tripId}`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              {isEditing ? 'Update' : 'Create'} Activity
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}