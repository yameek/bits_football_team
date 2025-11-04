'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMembers } from '@/hooks/useMembers';
import { useSessions } from '@/hooks/useSessions';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@/lib/api/reports';
import { alertApi } from '@/lib/api/alerts';
import { DollarSign, Users, Calendar, AlertTriangle, TrendingDown } from 'lucide-react';

export default function Dashboard() {
  const { data: members, isLoading: membersLoading } = useMembers();
  const { data: sessions, isLoading: sessionsLoading } = useSessions({ status: 'planned' });
  const { data: teamBalance } = useQuery({
    queryKey: ['teamBalance'],
    queryFn: reportApi.getTeamBalance,
  });
  const { data: alerts } = useQuery({
    queryKey: ['alerts', 'unresolved'],
    queryFn: alertApi.getUnresolved,
  });

  const activeMembers = members?.filter(m => m.status === 'active').length || 0;
  const upcomingSessions = sessions?.length || 0;
  const balance = teamBalance?.current_balance || '0';
  const balanceNum = parseFloat(balance);
  const isBelowThreshold = balanceNum < 5000;
  const lowBalanceMembers = members?.filter(m => parseFloat(m.balance) < 250).length || 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to BITS Football Team Treasury</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Team Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {balanceNum.toFixed(2)} BDT
              </div>
              {isBelowThreshold && (
                <Badge variant="destructive" className="mt-2">
                  Below Threshold
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Members
              </CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeMembers}</div>
              {membersLoading && <p className="text-xs text-gray-500">Loading...</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Upcoming Sessions
              </CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingSessions}</div>
              {sessionsLoading && <p className="text-xs text-gray-500">Loading...</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Low Balance Members
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowBalanceMembers}</div>
              {lowBalanceMembers > 0 && (
                <Badge variant="outline" className="mt-2 border-yellow-500 text-yellow-700">
                  Needs Attention
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {alerts && alerts.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Active Alerts</h2>
            <div className="space-y-2">
              {alerts.slice(0, 5).map((alert) => (
                <Alert key={alert.id} variant={alert.alert_type === 'treasury_low' ? 'destructive' : 'default'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/members/new"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">Add New Member</h3>
              <p className="text-sm text-gray-600 mt-1">Register a new team member</p>
            </a>
            <a 
              href="/sessions/new"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">Create Session</h3>
              <p className="text-sm text-gray-600 mt-1">Schedule a practice or match</p>
            </a>
            <a 
              href="/members"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">View Members</h3>
              <p className="text-sm text-gray-600 mt-1">Manage team members</p>
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
