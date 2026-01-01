import CollaboratorsClient from '@/components/collaborators/CollaboratorsClient';
import { getReceivedInvitations, getRoomCollab } from '@/lib/api';

interface pageProps{
    params: {
        tripId: string,
    }
}

const page = async({params}: pageProps) => {
    const {tripId} = params;
    const collab = await getRoomCollab(tripId);
    const receivedInvitations = await getReceivedInvitations();
    return (
        <CollaboratorsClient 
            collaborators={collab.collaborators}
            pendingInvitations={pendingInvitations} 
            receivedInvitations={receivedInvitations}
            tripId={tripId}
        />
    )
}

export default page;