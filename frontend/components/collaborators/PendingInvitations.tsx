"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, X } from 'lucide-react';
import { Button } from '../ui/button';

interface PendingInvitation {
  _id: string;
  email: string;
  sentAt: string;
}

const PendingInvitations = ({ 
  invitations 
}: { 
  invitations: PendingInvitation[] 
}) => {
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
    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-amber-600" />
            Pending Invitations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-sm text-muted-foreground">
              No pending invitations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-amber-600" />
          Pending Invitations
          <span className="ml-auto text-sm font-normal bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            {invitations.length}
          </span>
        </CardTitle>
        <CardDescription className="text-xs">
          Invitations waiting to be accepted
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {invitations.map((invitation) => (
            <div
              key={invitation._id}
              className="group relative flex items-start gap-3 p-3 rounded-lg bg-white border border-amber-100 hover:border-amber-300 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="font-medium text-sm text-slate-900 truncate">
                  {invitation.email}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sent {formatDate(invitation.sentAt)}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCancel(invitation._id, invitation.email)}
                className="flex-shrink-0 h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Cancel invitation"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingInvitations;