import CollaboratorsClient from '@/components/collaborators/CollaboratorsClient';
import { getRoomCollab } from '@/lib/api';

interface pageProps{
    params: {
        tripId: string,
    }
}

const page = async({params}: pageProps) => {
    const {tripId} = params;
    const collab = await getRoomCollab(tripId);
    
    return (
        <CollaboratorsClient 
            collaborators={collab.collaborators}
            pendingInvitations={collab.pendingInvitations} // optional
            tripId={tripId}
        />
    )
}

export default page;