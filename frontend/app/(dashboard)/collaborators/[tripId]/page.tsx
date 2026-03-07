import CollaboratorsClient from '@/components/collaborators/CollaboratorsClient';
import { getReceivedInvitations, getRoomCollab, getSentInvitations } from '@/lib/api';

interface pageProps{
    params: {
        tripId: string,
    },
    searchParams: {
        isCompleted?: string
    }
}

const page = async({params, searchParams}: pageProps) => {
    const awaitedParams = await params;
    const {tripId} = awaitedParams;
    const collab = await getRoomCollab(tripId);
    const pendingInvitations = await getSentInvitations();
    const receivedInvitations = await getReceivedInvitations();
    const isCompleted = await searchParams.isCompleted === "true";
    return (
        <CollaboratorsClient 
            collaborators={collab}
            pendingInvitations={pendingInvitations} 
            receivedInvitations={receivedInvitations}
            tripId={tripId}
            isCompleted={isCompleted}
        />
    )
}

export default page;