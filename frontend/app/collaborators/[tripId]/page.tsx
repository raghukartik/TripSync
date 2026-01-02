import CollaboratorsClient from '@/components/collaborators/CollaboratorsClient';
import { getReceivedInvitations, getRoomCollab, getSentInvitations } from '@/lib/api';

interface pageProps{
    params: {
        tripId: string,
    }
}

const page = async({params}: pageProps) => {
    const awaitedParams = await params;
    const {tripId} = awaitedParams;
    const collab = await getRoomCollab(tripId);
    const pendingInvitations = await getSentInvitations();
    const receivedInvitations = await getReceivedInvitations();
    return (
        <CollaboratorsClient 
            collaborators={collab}
            pendingInvitations={pendingInvitations} 
            receivedInvitations={receivedInvitations}
            tripId={tripId}
        />
    )
}

export default page;