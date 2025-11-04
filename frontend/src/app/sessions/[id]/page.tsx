'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { useSession } from '@/hooks/useSessions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = parseInt(params.id as string);
  const { data: session, isLoading } = useSession(sessionId);

  if (isLoading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (!session) return <MainLayout><div>Session not found</div></MainLayout>;

  const totalCost = parseFloat(session.total_cost);
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
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold capitalize">{session.session_type}</h1>
              <Badge className={getStatusColor(session.status)}>
                {session.status}
              </Badge>
            </div>
            <div className="flex items-center text-gray-600 mt-2">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(session.scheduled_date).toLocaleString()}
            </div>
          </div>
          <div className="flex space-x-2">
            {session.status === 'planned' && (
              <>
                <Link href={`/sessions/${sessionId}/attendance`}>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Mark Attendance
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {session.field && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <div>
                    <p className="font-medium">{session.field.name}</p>
                    {session.field.location && (
                      <p className="text-sm text-gray-600">{session.field.location}</p>
                    )}
                  </div>
                </div>
              )}
              {session.notes && (
                <div>
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="text-sm">{session.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Field Cost</span>
                <span className="font-medium">{parseFloat(session.field_cost).toFixed(2)} BDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transport</span>
                <span className="font-medium">{parseFloat(session.transport_cost).toFixed(2)} BDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Drinks</span>
                <span className="font-medium">{parseFloat(session.drinks_cost).toFixed(2)} BDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Emergency Fund</span>
                <span className="font-medium">{parseFloat(session.emergency_fund).toFixed(2)} BDT</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">Total Cost</span>
                <span className="text-2xl font-bold">{totalCost.toFixed(2)} BDT</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {session.status === 'completed' && (
          <Card>
            <CardHeader>
              <CardTitle>Session Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                This session has been finalized. View the transactions to see member charges.
              </p>
            </CardContent>
          </Card>
        )}

        {session.status === 'planned' && (
          <Card className="bg-blue-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>Mark attendance for all members</li>
                <li>Add any guests who attended</li>
                <li>Finalize the session to charge members</li>
              </ol>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
