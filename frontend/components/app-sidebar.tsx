"use client";

import * as React from "react";
import { Map, BookOpen, FolderOpen, Settings2, PlusCircle } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Sample TripSync Data
const data = {
  user: {
    name: "Kartik",
    email: "kartik@example.com",
    avatar: "/avatars/kartik.jpg",
  },
  teams: [
    {
      name: "Goa Getaway",
      logo: Map,
      plan: "Premium",
    },
    {
      name: "Manali Escape",
      logo: Map,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "My Trips",
      url: "/dashboard/trips",
      icon: Map,
      isActive: true,
      items: [
        {
          title: "Upcoming",
          url: "/dashboard/trips/upcoming-trips",
        },
        {
          title: "Completed",
          url: "/dashboard/trips/completed",
        },
        {
          title: "Create Trip",
          url: "/dashboard/create-trip",
        },
        {
          title: "Trip Chat",
          url: "/dashboard/trips/chat",
        },
      ],
    },
    {
      title: "Travel Stories",
      url: "/dashboard/stories",
      icon: BookOpen,
      items: [
        {
          title: "My Stories",
          url: "/dashboard/stories/mine",
        },
        {
          title: "Write New",
          url: "/dashboard/stories/new",
        },
      ],
    },
    {
      title: "Resources",
      url: "/dashboard/resources",
      icon: FolderOpen,
      items: [
        {
          title: "Shared Files",
          url: "/dashboard/resources/files",
        },
        {
          title: "Packing Lists",
          url: "/dashboard/resources/lists",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "/dashboard/settings/profile",
        },
        {
          title: "Account",
          url: "/dashboard/settings/account",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Create New Trip",
      url: "/dashboard/trips/create",
      icon: PlusCircle,
    },
    {
      name: "Write Story",
      url: "/dashboard/stories/new",
      icon: BookOpen,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="text-xl font-bold px-4 py-2">TripSync</div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
