"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';


interface Collaborator {
  _id: string;
  name: string;
  email: string;
}

const CollaboratorsList = ({ 
  collaborators 
}: { 
  collaborators: Collaborator[] 
}) => {
  const handleRemove = (id: string, name: string) => {
    if (confirm(`Remove ${name} from this trip?`)) {
      // Handle removal logic
      console.log('Remove collaborator:', id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Collaborators ({collaborators.length})
        </CardTitle>
        <CardDescription>People who have access to this trip</CardDescription>
      </CardHeader>
      <CardContent>
        {collaborators.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No collaborators yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {collaborators.map((collab) => (
              <div
                key={collab._id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {collab.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{collab.name}</p>
                    <p className="text-sm text-muted-foreground">{collab.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(collab._id, collab.name)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollaboratorsList;
