import SendInvitation from "./SendInvitation";
import PendingInvitations from "./PendingInvitations";
import CollaboratorsList from "./CollaboratorsList";

const CollaboratorsClient = ({ 
  collaborators, 
  pendingInvitations = [],
  tripId 
}: CollaboratorsClientProps) => {
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
        <PendingInvitations invitations={pendingInvitations} />
        <CollaboratorsList collaborators={collaborators} />
      </div>
    </div>
  );
};

export default CollaboratorsClient;