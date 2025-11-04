'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { useSession } from '@/hooks/useSessions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionApi } from '@/lib/api/sessions';
import { useState } from 'react';

export default function UpdateSessionCostsPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const sessionId = parseInt(params.id as string);
  const { data: session, isLoading } = useSession(sessionId);
  const [open, setOpen] = useState(false);
  const [costs, setCosts] = useState({
    fieldCost: '',
    transportCost: '',
    drinksCost: '',
    emergencyFund: '',
  });

  const updateCosts = useMutation({
    mutationFn: async (updateData: any) => {
      const result = await sessionApi.update(sessionId, updateData);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', sessionId] });
      setOpen(false);
    },
  });

  const handleUpdateCosts = () => {
    updateCosts.mutate({
      fieldCost: parseFloat(costs.fieldCost),
      transportCost: parseFloat(costs.transportCost),
      drinksCost: parseFloat(costs.drinksCost),
      emergencyFund: parseFloat(costs.emergencyFund),
    });
  };

  if (isLoading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (!session) return <MainLayout><div>Session not found</div></MainLayout>;

  const totalCost = 
    parseFloat(costs.fieldCost || '0') +
    parseFloat(costs.transportCost || '0') +
    parseFloat(costs.drinksCost || '0') +
    parseFloat(costs.emergencyFund || '0');

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Update Session Costs</h1>
          <p className="text-gray-600 mt-1">Add final costs after session completion</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Field Cost:</span>
                <span>{parseFloat(session.field_cost).toFixed(2)} BDT</span>
              </div>
              <div className="flex justify-between">
                <span>Transport:</span>
                <span>{parseFloat(session.transport_cost).toFixed(2)} BDT</span>
              </div>
              <div className="flex justify-between">
                <span>Drinks:</span>
                <span>{parseFloat(session.drinks_cost).toFixed(2)} BDT</span>
              </div>
              <div className="flex justify-between">
                <span>Emergency:</span>
                <span>{parseFloat(session.emergency_fund).toFixed(2)} BDT</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>{parseFloat(session.total_cost).toFixed(2)} BDT</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Update Costs</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Session Costs</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Field Cost (BDT)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={costs.fieldCost}
                  onChange={(e) => setCosts({ ...costs, fieldCost: e.target.value })}
                  placeholder={session.field_cost}
                />
              </div>
              <div>
                <Label>Transport Cost (BDT)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={costs.transportCost}
                  onChange={(e) => setCosts({ ...costs, transportCost: e.target.value })}
                  placeholder={session.transport_cost}
                />
              </div>
              <div>
                <Label>Drinks Cost (BDT)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={costs.drinksCost}
                  onChange={(e) => setCosts({ ...costs, drinksCost: e.target.value })}
                  placeholder={session.drinks_cost}
                />
              </div>
              <div>
                <Label>Emergency Fund (BDT)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={costs.emergencyFund}
                  onChange={(e) => setCosts({ ...costs, emergencyFund: e.target.value })}
                  placeholder={session.emergency_fund}
                />
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between">
                  <span className="font-semibold">New Total:</span>
                  <span className="text-xl font-bold">{totalCost.toFixed(2)} BDT</span>
                </div>
              </div>
              <Button 
                onClick={handleUpdateCosts}
                disabled={updateCosts.isPending}
                className="w-full"
              >
                {updateCosts.isPending ? 'Updating...' : 'Update Costs'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
