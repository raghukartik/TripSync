"use client";

import * as React from "react";
import { Map, BookOpen, FolderOpen, Settings2, PlusCircle, LayoutDashboardIcon } from "lucide-react";
import { getUserInfo } from "@/lib/api";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";


interface User {
  name: string;
  email: string;
  avatar?: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<User | null>(null);
  const { state, isMobile } = useSidebar();
  React.useEffect(() => {
    async function fetchUser() {
      const data = await getUserInfo();
      if (data) {
        setUser({
          name: data.name,
          email: data.email,
          avatar: data.avatar,
        });
      }
    }
    fetchUser();
  }, []);
  const navMain = [
    {
      title: "Dashboard",
      url: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      title: "My Trips",
      url: "/dashboard/trips",
      icon: Map,
      isActive: true,
      items: [
        { title: "Upcoming", url: "/dashboard/trips/upcoming-trips" },
        {title: "Ongoing", url: "/ongoing-trips"},
        { title: "Completed", url: "/completed-trips" },
        { title: "Create Trip", url: "/dashboard/create-trip" },
        { title: "Trip Chat", url: "/dashboard/trips/chat" },
      ],
    },
    {
      title: "Resources",
      url: "/dashboard/resources",
      icon: FolderOpen,
      items: [
        { title: "Shared Files", url: "/dashboard/resources/files" },
        { title: "Packing Lists", url: "/dashboard/resources/lists" },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        { title: "Profile", url: "/dashboard/settings/profile" },
        { title: "Account", url: "/dashboard/settings/account" },
      ],
    },
  ];

  const projects = [
    {
      name: "Create New Trip",
      url: "/dashboard/trips/create",
      icon: PlusCircle,
    },
    { name: "Write Story", url: "/dashboard/stories/new", icon: BookOpen },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div
          className={`flex items-center h-14 font-bold text-xl ${
            isMobile
              ? "px-4 justify-start"
              : state === "collapsed"
                ? "justify-center"
                : "px-4"
          }`}
        >
          {isMobile || state === "expanded" ? "TripSync" : "TS"}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <NavUser {...user} />
        ) : (
          <div className="px-4 py-2 text-sm text-muted-foreground">
            Loading user...
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
