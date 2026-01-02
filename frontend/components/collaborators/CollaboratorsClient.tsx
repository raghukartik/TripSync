"use client";

import SendInvitation from "./SendInvitation";
import PendingInvitations from "./PendingInvitations";
import CollaboratorsList from "./CollaboratorsList";
import ReceivedPendingInvitations from "./RecievedInvitation";
import { Card, CardContent } from '@/components/ui/card';

interface InvitedBy {
  name: string,
  email: string,
  _id: string
}

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
  invitedBy: InvitedBy;
  createdAt: string;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2">
            Manage Collaborators
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Invite people to collaborate on this trip and manage access
          </p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Actions (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Collaborators */}
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <CollaboratorsList collaborators={collaborators} />
              </CardContent>
            </Card>

            {/* Send Invitation */}
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <SendInvitation tripId={tripId} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Invitations (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Received Invitations - Fixed overflow */}
            {receivedInvitations.length > 0 && (
              <Card className="shadow-sm border-blue-200 bg-blue-50/30">
                <CardContent className="pt-6">
                  <ReceivedPendingInvitations invitations={receivedInvitations} />
                </CardContent>
              </Card>
            )}

            {/* Pending Invitations */}
            <Card className="shadow-sm border-amber-200 bg-amber-50/30">
              <CardContent className="pt-6">
                <PendingInvitations invitations={pendingInvitations} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorsClient;