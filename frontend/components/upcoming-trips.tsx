"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  MessageSquare,
  Edit,
  Plus,
  List,
  DollarSign,
  Users,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import FooterSection from "./footer";
import { useRouter } from 'next/navigation';

type Trip = {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  collaborators: { name: string; email?: string }[];
  tasks: any[];
  expenses: any[];
  itinerary: any[];
  [key: string]: unknown;
};


const TripCard = ({ trip }: { trip: Trip }) => {
  const router = useRouter();
  const durationInDays = Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const collaboratorsCount = trip.collaborators?.length || 0;
  const tasksCount = trip.tasks?.length || 0;
  const completedTasksCount =
    trip.tasks?.filter((task) => task.completed).length || 0;
  const expensesTotal =
    trip.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const itineraryDays = trip.itinerary?.length || 0;

  return (
    <Card className="hover:shadow-md transition-shadow relative group">
      {/* Trip Header with Title and Dates */}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {trip.title}
          </CardTitle>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {durationInDays} {durationInDays === 1 ? "day" : "days"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(trip.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            {" - "}
            {new Date(trip.endDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </CardHeader>

      {/* Trip Content */}
      <CardContent className="pt-0">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3 mt-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-blue-500" />
            <span>
              {collaboratorsCount} {collaboratorsCount === 1 ? "person" : "people"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>
              {completedTasksCount}/{tasksCount} tasks
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-purple-500" />
            <span>${expensesTotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span>
              {itineraryDays} {itineraryDays === 1 ? "day" : "days"} planned
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-between border-t pt-3">
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <MessageSquare className="h-4 w-4" />
            <span>Chat</span>
          </button>
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors" onClick={() => router.push(`/itinerary/${trip._id}`)}>
            <List className="h-4 w-4" />
            <span>Itinerary</span>
          </button>
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors" onClick={() => router.push(`/expenses/${trip._id}`)}>
            <DollarSign className="h-4 w-4" />
            <span>Expenses</span>
          </button>
        </div>
      </CardContent>

      {/* Hover Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

const UpcomingTrips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error: {error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Trips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                You have no upcoming trips
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Start by creating a new trip
              </p>
              <Button className="mt-4">Create Trip</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <FooterSection />
    </>
  );
};

export default UpcomingTrips;