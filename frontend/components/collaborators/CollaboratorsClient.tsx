"use client";

import SendInvitation from "./SendInvitation";
import PendingInvitations from "./PendingInvitations";
import CollaboratorsList from "./CollaboratorsList";
import ReceivedPendingInvitations from "./RecievedInvitation";

interface Collaborators{
  _id: string;
  name: string, 
  email: string,
}

interface PendingInvitation {
  _id: string;
  email: string;
  sentAt: string;
}

interface ReceivedInvitation {
  _id: string;
  tripId: string;
  tripName: string;
  inviterName: string;
  inviterEmail: string;
  receivedAt: string;
}

interface CollabClientProps{
  collaborators: Collaborators[],
  pendingInvitations: PendingInvitation[],
  receivedInvitations: ReceivedInvitation[];
  tripId: string
}


const CollaboratorsClient = ({ 
  collaborators = [],
  pendingInvitations = [],
  receivedInvitations = [],
  tripId 
}: CollabClientProps) => {
  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Manage Collaborators</h1>
        <p className="text-muted-foreground">
          Invite people to collaborate on this trip and manage access
        </p>
      </div>

      <div className="grid gap-6">
        <SendInvitation tripId={tripId} />
         <ReceivedPendingInvitations invitations={receivedInvitations} />
        <PendingInvitations invitations={pendingInvitations} />
        <CollaboratorsList {...collaborators} />
      </div>
    </div>
  );
};

export default CollaboratorsClient;