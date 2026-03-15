import React from "react";
import { Trip } from "@/components/upcoming-trips";
import { getOngoingTrips } from "@/lib/api";
import OngoingTrips from "@/components/ongoingTrips/ongoing-trips";

export const dynamic = "force-dynamic";

const ongoingTrips = async () => {
  const data = await getOngoingTrips();

  const ongoingTrips: Trip[] = data?.trips ?? data ?? [];
  return (
    <div>
      <OngoingTrips ongoingTrips={ongoingTrips} />
    </div>
  );
};

export default ongoingTrips;
