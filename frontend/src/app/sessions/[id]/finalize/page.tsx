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

  const { data: totalCostData } = useQuery({
    queryKey: ['sessions', sessionId, 'total-cost'],
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

  if (!session || !attendance || !totalCostData) {
    return <MainLayout><div>Loading...</div></MainLayout>;
  }

  const presentCount = attendance.filter((a: any) => a.status === 'present' || a.status === 'late').length;
  const absentCount = attendance.filter((a: any) => a.status === 'absent').length;
  const totalCost = totalCostData?.totalCost || parseFloat(session.total_cost) || 0;
  const perHeadFee = presentCount > 0 ? Math.round((totalCost / presentCount) * 4) / 4 : 0;

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
                {totalCost.toFixed(2)} BDT
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
                {perHeadFee.toFixed(2)} BDT
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {presentCount > 0 ? `(${totalCost.toFixed(2)} / ${presentCount} = ${(totalCost / presentCount).toFixed(2)}, rounded to 0.25)` : 'No attendees'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendees to be Charged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendance.filter((a: any) => a.status === 'present' || a.status === 'late').map((att: any) => {
                const member = att.member;
                if (!member) return null;
                
                const currentBalance = parseFloat(member.balance || '0');
                const newBalance = currentBalance - perHeadFee;
                const willBeLowBalance = newBalance < 250;
                
                return (
                  <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>Current: {currentBalance.toFixed(2)} BDT</span>
                        <span>→</span>
                        <span className={willBeLowBalance ? 'text-orange-600 font-medium' : ''}>
                          New: {newBalance.toFixed(2)} BDT
                        </span>
                      </div>
                      {willBeLowBalance && (
                        <div className="flex items-center mt-1 text-xs text-orange-600">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Will be below 250 BDT threshold
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">
                        -{perHeadFee.toFixed(2)} BDT
                      </p>
                    </div>
                  </div>
                );
              })}
              {presentCount === 0 && (
                <p className="text-center text-gray-500 py-4">No attendees marked as present</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Cost:</span>
                <span className="font-medium">{totalCost.toFixed(2)} BDT</span>
              </div>
              <div className="flex justify-between">
                <span>Attendees:</span>
                <span className="font-medium">{presentCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Per-Head Fee:</span>
                <span className="font-medium">{perHeadFee.toFixed(2)} BDT</span>
              </div>
              <div className="flex justify-between">
                <span>Total to be Collected:</span>
                <span className="font-medium">{((perHeadFee * presentCount)).toFixed(2)} BDT</span>
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
