'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertApi } from '@/lib/api/alerts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle, DollarSign, TrendingDown } from 'lucide-react';
import { useState } from 'react';

export default function AlertsPage() {
  const queryClient = useQueryClient();
  const [resolveId, setResolveId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  const { data: unresolvedAlerts, isLoading: unresolvedLoading } = useQuery({
    queryKey: ['alerts', 'unresolved'],
    queryFn: alertApi.getUnresolved,
  });

  const { data: allAlerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertApi.getAll({}),
  });

  const resolveAlert = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) =>
      alertApi.resolve(id, notes ? { notes } : undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setResolveId(null);
      setNotes('');
    },
  });

  const resolvedAlerts = allAlerts?.filter((a: any) => a.is_resolved);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'treasury_low': return <DollarSign className="h-5 w-5" />;
      case 'member_low_balance': return <TrendingDown className="h-5 w-5" />;
      case 'fine_applied': return <AlertTriangle className="h-5 w-5" />;
      case 'consecutive_absence': return <AlertTriangle className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'treasury_low': return 'border-red-200 bg-red-50';
      case 'member_low_balance': return 'border-yellow-200 bg-yellow-50';
      case 'fine_applied': return 'border-orange-200 bg-orange-50';
      case 'consecutive_absence': return 'border-orange-200 bg-orange-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'treasury_low': return 'bg-red-100 text-red-800';
      case 'member_low_balance': return 'bg-yellow-100 text-yellow-800';
      case 'fine_applied': return 'bg-orange-100 text-orange-800';
      case 'consecutive_absence': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const AlertCard = ({ alert, resolved = false }: { alert: any; resolved?: boolean }) => (
    <Card className={`p-4 border-l-4 ${getAlertColor(alert.alert_type)}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {getAlertIcon(alert.alert_type)}
            <Badge className={getTypeColor(alert.alert_type)}>
              {alert.alert_type.replace('_', ' ')}
            </Badge>
            {alert.member && (
              <span className="text-sm font-medium">{alert.member.name}</span>
            )}
          </div>
          <p className="text-gray-700">{alert.message}</p>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(alert.triggered_at).toLocaleString()}
          </p>
          {resolved && alert.resolved_at && (
            <p className="text-xs text-green-600 mt-1">
              Resolved: {new Date(alert.resolved_at).toLocaleString()}
            </p>
          )}
        </div>
        {!resolved && (
          <Dialog open={resolveId === alert.id} onOpenChange={(open) => !open && setResolveId(null)}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setResolveId(alert.id)}
              >
                Resolve
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Resolve Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Alert:</p>
                  <p className="font-medium">{alert.message}</p>
                </div>
                <div>
                  <Label>Resolution Notes (Optional)</Label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., Collected 2000 BDT contributions"
                  />
                </div>
                <Button 
                  onClick={() => resolveAlert.mutate({ id: alert.id, notes })}
                  disabled={resolveAlert.isPending}
                  className="w-full"
                >
                  {resolveAlert.isPending ? 'Resolving...' : 'Mark as Resolved'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Card>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Alerts</h1>
            <p className="text-gray-600 mt-1">Monitor system alerts and notifications</p>
          </div>
          <Badge variant="destructive" className="text-lg px-3 py-1">
            {unresolvedAlerts?.length || 0} Unresolved
          </Badge>
        </div>

        <Tabs defaultValue="unresolved" className="w-full">
          <TabsList>
            <TabsTrigger value="unresolved">
              Unresolved ({unresolvedAlerts?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved ({resolvedAlerts?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unresolved" className="space-y-3 mt-6">
            {unresolvedLoading ? (
              <div>Loading alerts...</div>
            ) : unresolvedAlerts && unresolvedAlerts.length > 0 ? (
              unresolvedAlerts.map((alert: any) => (
                <AlertCard key={alert.id} alert={alert} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">All Clear!</h3>
                <p className="text-gray-600">No unresolved alerts at this time</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-3 mt-6">
            {resolvedAlerts && resolvedAlerts.length > 0 ? (
              resolvedAlerts.map((alert: any) => (
                <AlertCard key={alert.id} alert={alert} resolved />
              ))
            ) : (
              <Card className="p-12 text-center">
                <p className="text-gray-600">No resolved alerts</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
