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
    startTime: '',
    endTime: '',
    fieldBookingAmount: '0',
    notes: '',
  });

  const { data: fields } = useQuery({
    queryKey: ['fields'],
    queryFn: async () => {
      const { data } = await api.get('/fields');
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Combine date and start time for scheduledStart
      const scheduledStart = `${formData.scheduledDate}T${formData.startTime}:00Z`;
      // Combine date and end time for scheduledEnd (if provided)
      const scheduledEnd = formData.endTime ? `${formData.scheduledDate}T${formData.endTime}:00Z` : undefined;
      
      const result = await createSession.mutateAsync({
        fieldId: parseInt(formData.fieldId),
        sessionType: formData.sessionType,
        scheduledStart,
        scheduledEnd,
        fieldCost: parseFloat(formData.fieldBookingAmount) || 0,
        // Transport, drinks, and emergency fund will be added later by treasurer
        transportCost: 0,
        drinksCost: 0,
        emergencyFund: 0,
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
                        {field.name} {field.address && `- ${field.address}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date *</Label>
                <Input
                  type="date"
                  required
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time *</Label>
                  <Input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Time *</Label>
                  <Input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Field Booking</h3>
                <div>
                  <Label>Field Booking Amount (BDT)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.fieldBookingAmount}
                    onChange={(e) => setFormData({ ...formData, fieldBookingAmount: e.target.value })}
                    placeholder="Partial field fee paid in advance"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Other costs (transport, drinks, emergency) will be added later by treasurer
                  </p>
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
