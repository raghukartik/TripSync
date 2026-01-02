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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
            Manage Collaborators
          </h1>
          <p className="text-lg text-slate-600">
            Invite people to collaborate on this trip and manage access
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Collaborators - Most Important */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <CollaboratorsList collaborators={collaborators} />
            </div>

            {/* Send Invitation */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <SendInvitation tripId={tripId} />
            </div>
          </div>

          {/* Right Column - Invitations */}
          <div className="lg:col-span-1 space-y-6">
            {/* Received Invitations */}
            {receivedInvitations.length > 0 && (
              <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-6">
                <ReceivedPendingInvitations invitations={receivedInvitations} />
              </div>
            )}

            {/* Pending Invitations */}
            <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-200 p-6">
              <PendingInvitations invitations={pendingInvitations} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorsClient;