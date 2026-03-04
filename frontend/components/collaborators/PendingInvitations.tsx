"use client";

import { Clock} from 'lucide-react';
import { PendingInvitation } from './CollaboratorsClient';

interface pageProps{
  invitations: PendingInvitation[],
}

const PendingInvitations = ({invitations}: pageProps) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <Clock className="w-5 h-5 text-amber-600" />
      <h3 className="text-lg font-semibold">Pending Invitations</h3>
    </div>
    <p className="text-sm text-muted-foreground mb-4">Invitations waiting for response</p>
    {invitations.length === 0 ? (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 mx-auto text-amber-300 mb-2" />
        <p className="text-sm text-muted-foreground">No pending invitations</p>
      </div>
    ) : (
      <div className="space-y-2">
        {invitations.map((inv) => (
          <div key={inv._id} className="flex items-center justify-between p-3 rounded-lg border bg-white">
            <div>
              <p className="font-medium text-sm">{inv.email}</p>
              <p className="text-xs text-muted-foreground">Sent {new Date(inv.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);


export default PendingInvitations;