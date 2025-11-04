'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { useSession, useSessionAttendance, useFinalizeSession } from '@/hooks/useSessions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { sessionApi } from '@/lib/api/sessions';
import { AlertTriangle, DollarSign, Users } from 'lucide-react';

export default function FinalizeSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = parseInt(params.id as string);
  const { data: session } = useSession(sessionId);
  const { data: attendance } = useSessionAttendance(sessionId);
  const finalizeSession = useFinalizeSession();

  const { data: costCalculation } = useQuery({
    queryKey: ['sessions', sessionId, 'calculate-cost'],
    queryFn: () => sessionApi.calculateCost(sessionId),
    enabled: !!sessionId,
  });

  const handleFinalize = async () => {
    try {
      await finalizeSession.mutateAsync(sessionId);
      router.push(`/sessions/${sessionId}`);
    } catch (error) {
      console.error('Failed to finalize session:', error);
    }
  };

  if (!session || !attendance || !costCalculation) {
    return <MainLayout><div>Loading...</div></MainLayout>;
  }

  const presentCount = attendance.filter((a: any) => a.status === 'present' || a.status === 'late').length;
  const absentCount = attendance.filter((a: any) => a.status === 'absent').length;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Finalize Session</h1>
          <p className="text-gray-600 mt-1">
            Review charges before finalizing
          </p>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Once finalized, member balances will be updated and cannot be undone.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {parseFloat(session.total_cost).toFixed(2)} BDT
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Attendees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{presentCount}</div>
              <p className="text-xs text-gray-600">{absentCount} absent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Per-Head Fee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {costCalculation.perHeadFee?.toFixed(2) || '0.00'} BDT
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Member Charges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {costCalculation.charges?.map((charge: any) => {
                const willBeLowBalance = parseFloat(charge.newBalance) < 250;
                
                return (
                  <div key={charge.memberId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">{charge.memberName}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>Current: {parseFloat(charge.currentBalance).toFixed(2)} BDT</span>
                        <span>→</span>
                        <span className={willBeLowBalance ? 'text-orange-600 font-medium' : ''}>
                          New: {parseFloat(charge.newBalance).toFixed(2)} BDT
                        </span>
                      </div>
                      {charge.isNewMember && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          New Member Surcharge Applied
                        </Badge>
                      )}
                      {willBeLowBalance && (
                        <div className="flex items-center mt-1 text-xs text-orange-600">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Will be below 250 BDT threshold
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">
                        -{parseFloat(charge.amount).toFixed(2)} BDT
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {costCalculation.fines && costCalculation.fines.length > 0 && (
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800">Fines to be Applied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {costCalculation.fines.map((fine: any) => (
                  <div key={fine.memberId} className="flex items-center justify-between p-3 bg-orange-50 rounded-md">
                    <div>
                      <p className="font-medium">{fine.memberName}</p>
                      <p className="text-sm text-gray-600">
                        {fine.consecutiveAbsences} consecutive absences
                      </p>
                    </div>
                    <p className="text-lg font-bold text-orange-600">
                      -{parseFloat(fine.fineAmount).toFixed(2)} BDT (20%)
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Members Charged:</span>
                <span className="font-medium">{costCalculation.charges?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Fines Applied:</span>
                <span className="font-medium">{costCalculation.fines?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Members Below Threshold:</span>
                <span className="font-medium text-orange-600">
                  {costCalculation.charges?.filter((c: any) => parseFloat(c.newBalance) < 250).length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button 
            onClick={handleFinalize}
            disabled={finalizeSession.isPending}
            className="flex-1"
            size="lg"
          >
            {finalizeSession.isPending ? 'Finalizing...' : 'Confirm Finalization'}
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.back()}
            size="lg"
          >
            Cancel
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
