import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import DashboardClient from "@/components/user-dashboard"

// This would typically fetch data from your database/API
function getDashboardData() {
  // Mock data for demonstration - replace with actual data fetching
  const upcomingTrips = [
    {
      id: 1,
      destination: "Tokyo, Japan",
      dates: "Mar 15 - Mar 22, 2025",
      daysLeft: 24,
      status: "Planning",
      image: "🇯🇵"
    },
    {
      id: 2,
      destination: "Paris, France", 
      dates: "Jun 10 - Jun 17, 2025",
      daysLeft: 112,
      status: "Booked",
      image: "🇫🇷"
    }
  ]

  const recentTrips = [
    {
      id: 1,
      destination: "Bali, Indonesia",
      dates: "Dec 2024",
      rating: 5,
      image: "🇮🇩"
    },
    {
      id: 2,
      destination: "New York, USA",
      dates: "Oct 2024", 
      rating: 4,
      image: "🇺🇸"
    }
  ]

  const stats = [
    { label: "Countries Visited", value: 12, icon: "MapPin" },
    { label: "Total Trips", value: 28, icon: "Plane" },
    { label: "Travel Stories", value: 15, icon: "Camera" },
    { label: "Days Traveled", value: 180, icon: "CalendarDays" }
  ]

  const user = {
    name: "Kartik"
  }

  return {
    upcomingTrips,
    recentTrips,
    stats,
    user
  }
}

export default function Page() {
  const dashboardData = getDashboardData()

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
        
        <DashboardClient 
          upcomingTrips={dashboardData.upcomingTrips}
          recentTrips={dashboardData.recentTrips}
          stats={dashboardData.stats}
          user={dashboardData.user}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}