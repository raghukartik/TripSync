import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { getUserInfo, getUserCompletedTrips, getUserUpcomingTrips, getAllUserTrips } from "@/lib/auth"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import DashboardClient from "@/components/user-dashboard"


interface User {
  name: string;
}

interface Collaborators{
  _id: string;
  name: string;
  email: string;
}

interface Task {
  _id: string;
  completed: boolean;
}

interface Expenses{
  amount: number;
}

interface Trip {
  _id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  collaborators: [Collaborators];
  totalTasks: number;
  tasks: [Task];
  completedTasks: [string];
  expenses: [Expenses];
  hasStory: boolean;
  createdOn: Date;
  destinations:[string]
}

// Helper function to calculate days between dates
function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((date2.getTime() - date1.getTime()) / oneDay);
}

// Helper function to format date range
function formatDateRange(startDate: Date, endDate: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  };
  
  const start = startDate.toLocaleDateString('en-US', options);
  const end = endDate.toLocaleDateString('en-US', options);
  
  if (startDate.getFullYear() === endDate.getFullYear()) {
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${startMonth} - ${end}`;
  }
  
  return `${start} - ${end}`;
}

// Thifrom your databases fetches actual data 
async function fetchDashboardData() {
  const user: User = { name: "" };
  const data = await getUserInfo();
  if (data) {
    user.name = data.name;
  }

  const currentDate = new Date();
  
  try {
    // Fetch upcoming trips (trips with end date in the future)
    const {upComingTrips} = await getUserUpcomingTrips();

    // Fetch recent trips (completed trips, sorted by end date)
    const {completedTrips} = await getUserCompletedTrips();

    const {allTrips} = await getAllUserTrips();
   
    // Transform upcoming trips data
    const upcomingTrips = upComingTrips.map((trip: Trip) => ({
      id: trip._id.toString(),
      destination: trip.destinations,
      description: trip.description || '',
      dates: formatDateRange(new Date(trip.startDate), new Date(trip.endDate)),
      daysLeft: daysBetween(currentDate, new Date(trip.startDate)),
      status: trip.tasks.filter(task => task.completed).length === trip.tasks.length ? 'Ready' : 'Planning',
      collaborators: trip.collaborators.length,
      tasksProgress: trip.tasks.length > 0 ? 
        `${trip.tasks.filter(task => task.completed).length}/${trip.tasks.length}` : '0/0',
      totalExpenses: trip.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    }));

    // Transform recent trips data
    const recentTrips = completedTrips.map((trip:Trip) => ({
      id: trip._id.toString(),
      destination: trip.title,
      dates: formatDateRange(new Date(trip.startDate), new Date(trip.endDate)),
      collaborators: trip.collaborators.length,
      // hasStory: trip.story && Object.keys(trip.story.content).length > 0,
      totalExpenses: trip.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    }));

    // Calculate statistics
    
    // Get unique locations (trip titles as destinations)
    const uniqueDestinations = new Set(allTrips.map((trip: Trip) => trip.destinations));
    
    // Calculate total days traveled
    const totalDaysTraveled = allTrips.reduce((total:number, trip:Trip) => {
      return total + daysBetween(new Date(trip.startDate), new Date(trip.endDate)) + 1;
    }, 0);

    // Count stories written
    // const storiesWritten = allUserTrips.filter((trip: Trip) => 
    //   trip.story && Object.keys(trip.story.content).length > 0
    // ).length;

    const stats = [
      { label: "Destinations Visited", value: uniqueDestinations.size, icon: "MapPin" },
      { label: "Total Trips", value: allTrips.length, icon: "Plane" },
      // { label: "Travel Stories", value: storiesWritten, icon: "Camera" },
      { label: "Days Traveled", value: totalDaysTraveled, icon: "CalendarDays" }
    ];

    return {
      upcomingTrips,
      recentTrips,
      stats,
      user
    };

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    // Return empty data structure if database fetch fails
    return {
      upcomingTrips: [],
      recentTrips: [],
      stats: [
        { label: "Destinations Visited", value: 0, icon: "MapPin" },
        { label: "Total Trips", value: 0, icon: "Plane" },
        { label: "Travel Stories", value: 0, icon: "Camera" },
        { label: "Days Traveled", value: 0, icon: "CalendarDays" }
      ],
      user
    };
  }
}

export default async function Page() {
  const dashboardData = await fetchDashboardData();
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
       
        {dashboardData.user && (
          <DashboardClient
            upcomingTrips={dashboardData.upcomingTrips}
            recentTrips={dashboardData.recentTrips}
            stats={dashboardData.stats}
            user={dashboardData.user}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}