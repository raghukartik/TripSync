"use client"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CalendarDays,
  MapPin,
  Clock,
  Plane,
  Camera,
  TrendingUp,
  Users,
  CheckCircle2,
  Plus,
  LucideIcon
} from "lucide-react"
import { useState } from "react"

interface Trip {
  id: number
  destination: string
  dates: string
  daysLeft?: number
  status?: string
  rating?: number
  image: string
}

interface Stat {
  label: string
  value: number
  icon: string
}

interface User {
  name: string
}

interface DashboardClientProps {
  upcomingTrips: Trip[]
  recentTrips: Trip[]
  stats: Stat[]
  user: User
}

const iconMap: Record<string, LucideIcon> = {
  MapPin: MapPin,
  Plane: Plane,
  Camera: Camera,
  CalendarDays: CalendarDays
}

export default function DashboardClient({ 
  upcomingTrips, 
  recentTrips, 
  stats, 
  user 
}: DashboardClientProps) {
  const [isAddingTrip, setIsAddingTrip] = useState(false)

  // Handler for adding a new trip
  const handleAddTrip = () => {
    setIsAddingTrip(true)
    // Implementation would go here
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">Here&#39;s what&apos;s happening with your travels</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat, index) => {
          const IconComponent = iconMap[stat.icon]
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  {IconComponent && <IconComponent className="h-5 w-5 text-muted-foreground" />}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Upcoming Trips */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Upcoming Trips
              </CardTitle>
              <CardDescription>Your next adventures await</CardDescription>
            </div>
            <Button size="sm" onClick={handleAddTrip} disabled={isAddingTrip}>
              <Plus className="h-4 w-4 mr-2" />
              New Trip
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTrips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{trip.image}</div>
                  <div>
                    <h4 className="font-semibold">{trip.destination}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {trip.dates}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant={trip.status === 'Booked' ? 'default' : 'secondary'}>
                    {trip.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {trip.daysLeft} days left
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your next trip</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" onClick={handleAddTrip}>
              <Plus className="h-4 w-4 mr-2" />
              Plan New Trip
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Write Travel Story
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Start Trip Chat
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Browse Resources
            </Button>
          </CardContent>
        </Card>

        {/* Recent Trips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Recent Trips
            </CardTitle>
            <CardDescription>Your latest adventures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTrips.map((trip) => (
              <div key={trip.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="text-xl">{trip.image}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{trip.destination}</h4>
                  <p className="text-sm text-muted-foreground">{trip.dates}</p>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-xs ${i < (trip.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full">
              View All Trips
            </Button>
          </CardContent>
        </Card>

        {/* Travel Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Travel Goals 2025
            </CardTitle>
            <CardDescription>Your progress this year</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Countries Visited</span>
                <span>2/5</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '40%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Travel Stories</span>
                <span>3/12</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '25%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Days Traveled</span>
                <span>15/60</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: '25%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p><strong>Tokyo trip</strong> itinerary updated</p>
                  <p className="text-muted-foreground text-xs">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p>New travel story <strong>&quot;Bali Adventures&quot;</strong> published</p>
                  <p className="text-muted-foreground text-xs">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p><strong>Paris hotels</strong> research saved</p>
                  <p className="text-muted-foreground text-xs">3 days ago</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}