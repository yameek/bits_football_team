'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateSession } from '@/hooks/useSessions';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function NewSessionPage() {
  const router = useRouter();
  const createSession = useCreateSession();
  const [formData, setFormData] = useState({
    fieldId: '',
    sessionType: 'practice' as 'practice' | 'match',
    scheduledDate: '',
    scheduledTime: '',
    fieldCost: '600',
    transportCost: '100',
    drinksCost: '50',
    emergencyFund: '50',
    notes: '',
  });

  const { data: fields } = useQuery({
    queryKey: ['fields'],
    queryFn: async () => {
      const { data } = await api.get('/fields');
      return data;
    },
  });

  const totalCost = 
    parseFloat(formData.fieldCost || '0') +
    parseFloat(formData.transportCost || '0') +
    parseFloat(formData.drinksCost || '0') +
    parseFloat(formData.emergencyFund || '0');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const scheduledDate = `${formData.scheduledDate}T${formData.scheduledTime}:00Z`;
      const result = await createSession.mutateAsync({
        fieldId: parseInt(formData.fieldId),
        sessionType: formData.sessionType,
        scheduledDate,
        fieldCost: parseFloat(formData.fieldCost),
        transportCost: parseFloat(formData.transportCost),
        drinksCost: parseFloat(formData.drinksCost),
        emergencyFund: parseFloat(formData.emergencyFund),
        notes: formData.notes,
      });
      router.push(`/sessions/${result.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Session</h1>
          <p className="text-gray-600 mt-1">Schedule a practice or match session</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Session Type</Label>
                <Select 
                  value={formData.sessionType} 
                  onValueChange={(v: 'practice' | 'match') => setFormData({ ...formData, sessionType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="practice">Practice</SelectItem>
                    <SelectItem value="match">Match</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Field</Label>
                <Select 
                  value={formData.fieldId} 
                  onValueChange={(v) => setFormData({ ...formData, fieldId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields?.map((field: any) => (
                      <SelectItem key={field.id} value={field.id.toString()}>
                        {field.name} {field.location && `- ${field.location}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input
                    type="time"
                    required
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Cost Breakdown</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Field Cost (BDT)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.fieldCost}
                      onChange={(e) => setFormData({ ...formData, fieldCost: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Transport Cost (BDT)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.transportCost}
                      onChange={(e) => setFormData({ ...formData, transportCost: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Drinks Cost (BDT)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.drinksCost}
                      onChange={(e) => setFormData({ ...formData, drinksCost: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Emergency Fund (BDT)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.emergencyFund}
                      onChange={(e) => setFormData({ ...formData, emergencyFund: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Cost:</span>
                    <span className="text-2xl font-bold">{totalCost.toFixed(2)} BDT</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Notes (Optional)</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="pt-4 flex space-x-3">
                <Button 
                  type="submit" 
                  disabled={createSession.isPending || !formData.fieldId}
                  className="flex-1"
                >
                  {createSession.isPending ? 'Creating...' : 'Create Session'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
