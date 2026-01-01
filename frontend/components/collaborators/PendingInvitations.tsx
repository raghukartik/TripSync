"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Button } from '../ui/button';


const PendingInvitations = ({ invitations }: { invitations: PendingInvitation[] }) => {
  const handleCancel = (id: string, email: string) => {
    if (confirm(`Cancel invitation for ${email}?`)) {
      console.log('Cancel invitation:', id);
    }
  };

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

  if (!invitations || invitations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Pending Invitations ({invitations.length})
        </CardTitle>
        <CardDescription>Invitations waiting to be accepted</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invitations.map((invitation) => (
            <div
              key={invitation._id}
              className="flex items-center justify-between p-3 rounded-lg border border-dashed bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">{invitation.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Sent {formatDate(invitation.sentAt)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCancel(invitation._id, invitation.email)}
                className="text-muted-foreground hover:text-destructive"
              >
                Cancel
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingInvitations;