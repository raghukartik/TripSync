"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  MessageSquare,
  Plus,
  List,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  BookOpen,
  MessageCircle,
  ChevronRight,
  AlertCircle,
  User,
  CalendarDays,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FooterSection from "./footer";
import { useRouter } from 'next/navigation';

type Activity = {
  activityId: string;
  time?: string;
  title?: string;
  location?: string;
  notes?: string;
};

type ItineraryDay = {
  date: string;
  activities: Activity[];
};

type Task = {
  taskId: string;
  text: string;
  assignedTo?: string;
  completed: boolean;
};

type Expense = {
  amount: number;
  category?: string;
  spentBy?: string;
  sharedWith?: string[];
  note?: string;
  date: string;
};

type ChatMessage = {
  sender: string;
  message: string;
  sentAt: string;
};

type PendingInvite = {
  user: string;
  invitedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
};

type Collaborator = {
  _id: string;
  name: string;
  email?: string;
  avatar?: string;
};

type Trip = {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  owner: string;
  collaborators: Collaborator[];
  tasks: Task[];
  expenses: Expense[];
  itinerary: ItineraryDay[];
  chatMessages: ChatMessage[];
  pendingInvites: PendingInvite[];
  createdOn: string;
  story?: {
    visitedLocations: any[];
    updatedAt: string;
    contributors: any[];
  };
};

const TripCard = ({ trip }: { trip: Trip }) => {
  const router = useRouter();
  const today = new Date();
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  
  const durationInDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const daysUntilTrip = Math.ceil(
    (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const isStartingSoon = daysUntilTrip <= 7 && daysUntilTrip > 0;
  const isStartingToday = daysUntilTrip === 0;
  const isOverdue = daysUntilTrip < 0;

  const collaboratorsCount = trip.collaborators?.length || 0;
  const totalParticipants = collaboratorsCount + 1; // +1 for owner
  const tasksCount = trip.tasks?.length || 0;
  const completedTasksCount = trip.tasks?.filter((task) => task.completed).length || 0;
  const expensesTotal = trip.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const itineraryDays = trip.itinerary?.length || 0;
  const pendingInvitesCount = trip.pendingInvites?.filter(invite => invite.status === 'pending').length || 0;
  const unreadMessages = trip.chatMessages?.length || 0;
  
  // Calculate completion percentage
  const completionItems = [
    { completed: itineraryDays > 0, weight: 30 },
    { completed: tasksCount > 0, weight: 25 },
    { completed: completedTasksCount === tasksCount && tasksCount > 0, weight: 25 },
    { completed: collaboratorsCount > 0, weight: 20 }
  ];
  
  const completionPercentage = Math.round(
    completionItems.reduce((acc, item) => acc + (item.completed ? item.weight : 0), 0)
  );

  const getStatusColor = () => {
    if (isOverdue) return "bg-red-500";
    if (isStartingToday) return "bg-green-500";
    if (isStartingSoon) return "bg-amber-500";
    return "bg-blue-500";
  };

  const getStatusText = () => {
    if (isOverdue) return "In Progress";
    if (isStartingToday) return "Starting Today!";
    if (isStartingSoon) return `${daysUntilTrip} days to go`;
    if (daysUntilTrip <= 30) return `${daysUntilTrip} days away`;
    return "Upcoming";
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 relative group overflow-hidden">
      {/* Status Indicator */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${getStatusColor()}`}></div>
      
      {/* Trip Header */}
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold line-clamp-2 mb-2 text-gray-900">
              {trip.title}
            </CardTitle>
            {trip.description && (
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {trip.description}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 ml-4">
            <Badge variant="secondary" className={`${getStatusColor()} text-white border-0 font-medium`}>
              {getStatusText()}
            </Badge>
            {pendingInvitesCount > 0 && (
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                {pendingInvitesCount} pending invite{pendingInvitesCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>

        {/* Date and Duration */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-500" />
            <span className="font-medium">
              {startDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
              {" - "}
              {endDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: startDate.getFullYear() !== endDate.getFullYear() ? "numeric" : undefined,
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-500" />
            <span>{durationInDays} {durationInDays === 1 ? "day" : "days"}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Collaborators */}
        {collaboratorsCount > 0 && (
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                {totalParticipants} traveler{totalParticipants !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex -space-x-2">
              {trip.collaborators.slice(0, 4).map((collaborator) => (
                <Avatar key={collaborator._id} className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={collaborator.avatar} />
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                    {collaborator.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {collaboratorsCount > 4 && (
                <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    +{collaboratorsCount - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trip Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Trip Planning</span>
            <span className="text-sm text-gray-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <List className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-800">Itinerary</span>
            </div>
            <div className="text-lg font-bold text-blue-900">
              {itineraryDays}
              <span className="text-sm font-normal text-blue-700 ml-1">
                {itineraryDays === 1 ? "day" : "days"} planned
              </span>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-800">Tasks</span>
            </div>
            <div className="text-lg font-bold text-green-900">
              {completedTasksCount}/{tasksCount}
              <span className="text-sm font-normal text-green-700 ml-1">completed</span>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-800">Budget</span>
            </div>
            <div className="text-lg font-bold text-purple-900">
              ${expensesTotal.toFixed(0)}
              <span className="text-sm font-normal text-purple-700 ml-1">planned</span>
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-800">Activity</span>
            </div>
            <div className="text-lg font-bold text-amber-900">
              {unreadMessages}
              <span className="text-sm font-normal text-amber-700 ml-1">
                message{unreadMessages !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/itinerary/${trip._id}`)}
            className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700"
          >
            <List className="h-4 w-4" />
            Itinerary
            <ChevronRight className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/expenses/${trip._id}`)}
            className="flex items-center gap-2 hover:bg-purple-50 hover:text-purple-700"
          >
            <DollarSign className="h-4 w-4" />
            Expenses
            <ChevronRight className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-green-50 hover:text-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            Tasks
            <ChevronRight className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-orange-50 hover:text-orange-700"
          >
            <BookOpen className="h-4 w-4" />
            Story
            <ChevronRight className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-orange-50 hover:text-orange-700"
          >
            <MessageCircle className="h-4 w-4" />
            Chat
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>

      {/* Hover Actions */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 bg-white shadow-sm">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 bg-white shadow-sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

const UpcomingTrips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const getUpcomingTrips = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/user/upcoming-trips", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch upcoming trips");

        const data = await res.json();
        setTrips(data.data.upComingTrips || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setIsLoading(false);
      }
    };

    getUpcomingTrips();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-[300px]" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-2 w-full" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Error loading trips:</strong> {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Adventures</h1>
          <p className="text-gray-600">
            {trips.length > 0 
              ? `You have ${trips.length} upcoming ${trips.length === 1 ? 'trip' : 'trips'}`
              : 'No upcoming trips planned'
            }
          </p>
        </div>
        <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => router.push('/dashboard/create-trip')}>
          <Plus className="h-4 w-4" />
          New Trip
        </Button>
      </div>

      {trips.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready for your next adventure?</h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              Create your first trip and start planning an amazing journey with friends and family.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Trip
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      )}

      <FooterSection />
    </div>
  );
};

export default UpcomingTrips;