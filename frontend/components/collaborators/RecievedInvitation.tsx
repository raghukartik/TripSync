"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "../ui/button";
import { Mail } from "lucide-react";

interface ReceivedInvitation {
  _id: string;
  tripId: string;
  tripName: string;
  inviterName: string;
  inviterEmail: string;
  receivedAt: string;
}

const ReceivedPendingInvitations = ({ 
  invitations 
}: { 
  invitations: ReceivedInvitation[] 
}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleAccept = async (invitationId: string) => {
    setLoadingId(invitationId);
    try {
      // Add your API call here
      // await acceptInvitation(invitationId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from list after successful accept
      setRemovedIds(prev => new Set(prev).add(invitationId));
    } catch (error) {
      console.error('Failed to accept invitation:', error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDecline = async (invitationId: string) => {
    setLoadingId(invitationId);
    try {
      // Add your API call here
      // await declineInvitation(invitationId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from list after successful decline
      setRemovedIds(prev => new Set(prev).add(invitationId));
    } catch (error) {
      console.error('Failed to decline invitation:', error);
    } finally {
      setLoadingId(null);
    }
  };

  const visibleInvitations = invitations.filter(inv => !removedIds.has(inv._id));

  if (!invitations || visibleInvitations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Received Invitations ({visibleInvitations.length})
        </CardTitle>
        <CardDescription>Trip invitations you have received</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {visibleInvitations.map((invitation) => (
            <div
              key={invitation._id}
              className="flex items-center justify-between p-4 rounded-lg border bg-blue-50/50 border-blue-200"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{invitation.tripName}</p>
                  <p className="text-sm text-muted-foreground">
                    Invited by {invitation.inviterName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(invitation.receivedAt)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDecline(invitation._id)}
                  disabled={loadingId === invitation._id}
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  {loadingId === invitation._id ? 'Processing...' : 'Decline'}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAccept(invitation._id)}
                  disabled={loadingId === invitation._id}
                >
                  {loadingId === invitation._id ? 'Processing...' : 'Accept'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceivedPendingInvitations;