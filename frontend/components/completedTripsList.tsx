'use client';
import { CalendarDays, MapPin, Users, Clock, ChevronRight } from 'lucide-react';

interface Trip {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  story?: {
    visitedLocations: unknown[];
    updatedAt: string;
    contributors: any[];
  };
  owner?: string;
  collaborators?: any[];
  createdOn?: string;
  itinerary?: any[];
  tasks?: any[];
  expenses?: any[];
  chatMessages?: any[];
  pendingInvites?: any[];
}

export default function CompletedTripsList({ trips }: { trips: Trip[] }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
  };

  const getMonthYear = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (trips.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Travel Memories</h1>
          
          <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No completed trips yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Once you complete your adventures, they&#39;ll appear here as beautiful memories to look back on.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Travel Memories</h1>
          <p className="text-gray-600">
            {trips.length} completed {trips.length === 1 ? 'adventure' : 'adventures'}
          </p>
        </div>

        {/* Trips Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative">
                  <h2 className="font-bold text-xl mb-2 line-clamp-2 leading-tight">
                    {trip.title}
                  </h2>
                  <div className="flex items-center text-blue-100">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">
                      {getMonthYear(trip.startDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {trip.description}
                </p>

                {/* Trip Details */}
                <div className="space-y-3 mb-6">
                  {/* Duration */}
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="font-medium">
                      {formatDateRange(trip.startDate, trip.endDate)} trip
                    </span>
                  </div>

                  {/* Date Range */}
                  <div className="flex items-center text-sm text-gray-700">
                    <CalendarDays className="w-4 h-4 mr-3 text-gray-400" />
                    <span>
                      {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
                    </span>
                  </div>

                  {/* Contributors */}
                  {trip.story && trip.story.contributors && trip.story.contributors.length > 0 && (
                    <div className="flex items-center text-sm text-gray-700">
                      <Users className="w-4 h-4 mr-3 text-gray-400" />
                      <span>
                        {trip.story.contributors.length + 1} {trip.story.contributors.length === 0 ? 'traveler' : 'travelers'}
                      </span>
                    </div>
                  )}

                  {/* Visited Locations */}
                  {trip.story && trip.story.visitedLocations && trip.story.visitedLocations.length > 0 && (
                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                      <span>
                        {trip.story.visitedLocations.length} location{trip.story.visitedLocations.length !== 1 ? 's' : ''} visited
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-between group">
                  <span>View Memories</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        {trips.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {trips.length}
                </div>
                <div className="text-gray-600 text-sm uppercase tracking-wider font-medium">
                  Completed Trips
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {trips.reduce((total, trip) => {
                    const start = new Date(trip.startDate);
                    const end = new Date(trip.endDate);
                    const diffTime = Math.abs(end.getTime() - start.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return total + diffDays;
                  }, 0)}
                </div>
                <div className="text-gray-600 text-sm uppercase tracking-wider font-medium">
                  Total Days Traveled
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {trips.reduce((total, trip) => {
                    return total + (trip.story?.visitedLocations?.length || 0);
                  }, 0)}
                </div>
                <div className="text-gray-600 text-sm uppercase tracking-wider font-medium">
                  Locations Explored
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}