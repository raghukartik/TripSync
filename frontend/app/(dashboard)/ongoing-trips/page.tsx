import React from 'react'
import { Trip} from '@/components/upcoming-trips'
import { getOngoingTrips } from '@/lib/api'
import OngoingTrips from '@/components/ongoingTrips/ongoing-trips'


const ongoingTrips = async() => {
    const data = await getOngoingTrips();
    if(!data){

    }
    const ongoingTrips: Trip[] = data.trips;
    console.log(ongoingTrips);
  return (
    <div>
        <OngoingTrips ongoingTrips={ongoingTrips}/>
    </div>
  )
}

export default ongoingTrips