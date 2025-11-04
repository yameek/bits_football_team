'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { useSessions } from '@/hooks/useSessions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Calendar, MapPin } from 'lucide-react';

export default function SessionsPage() {
  const { data: sessions, isLoading } = useSessions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Sessions</h1>
            <p className="text-gray-600 mt-1">Manage practice and match sessions</p>
          </div>
          <Link href="/sessions/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Session
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div>Loading sessions...</div>
        ) : (
          <div className="space-y-4">
            {sessions?.map((session) => (
              <Link key={session.id} href={`/sessions/${session.id}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-semibold capitalize">
                          {session.session_type}
                        </h3>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(session.scheduled_date).toLocaleString()}
                        </div>
                        {session.field && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {session.field.name}
                            {session.field.location && ` - ${session.field.location}`}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Cost</p>
                      <p className="text-2xl font-bold">
                        {parseFloat(session.total_cost).toFixed(2)} BDT
                      </p>
                    </div>
                  </div>
                  {session.notes && (
                    <p className="mt-4 text-sm text-gray-600">{session.notes}</p>
                  )}
                </Card>
              </Link>
            ))}
            {sessions?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No sessions found</p>
                <Link href="/sessions/new">
                  <Button className="mt-4">Create First Session</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
