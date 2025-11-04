'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { useMember, useAddContribution } from '@/hooks/useMembers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { DollarSign, Phone, CreditCard, AlertCircle } from 'lucide-react';

export default function MemberDetailPage() {
  const params = useParams();
  const memberId = parseInt(params.id as string);
  const { data: member, isLoading } = useMember(memberId);
  const addContribution = useAddContribution();
  const [open, setOpen] = useState(false);
  const [contribution, setContribution] = useState({
    amount: '',
    method: 'cash' as 'cash' | 'bank' | 'mobile',
    notes: '',
  });

  const handleAddContribution = async () => {
    try {
      await addContribution.mutateAsync({
        id: memberId,
        data: {
          amount: parseFloat(contribution.amount),
          method: contribution.method,
          notes: contribution.notes,
        },
      });
      setOpen(false);
      setContribution({ amount: '', method: 'cash', notes: '' });
    } catch (error) {
      console.error('Failed to add contribution:', error);
    }
  };

  if (isLoading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (!member) return <MainLayout><div>Member not found</div></MainLayout>;

  const balance = parseFloat(member.balance);
  const balanceColor = balance < 0 ? 'text-red-600' : balance < 250 ? 'text-yellow-600' : 'text-green-600';

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{member.name}</h1>
            <div className="flex items-center space-x-3 mt-2">
              {member.pin && (
                <span className="text-gray-600">PIN: {member.pin}</span>
              )}
              <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                {member.status}
              </Badge>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <DollarSign className="h-4 w-4 mr-2" />
                Add Contribution
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Contribution</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Amount (BDT)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={contribution.amount}
                    onChange={(e) => setContribution({ ...contribution, amount: e.target.value })}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <Select value={contribution.method} onValueChange={(v: any) => setContribution({ ...contribution, method: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="mobile">bKash/Mobile</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Notes (Optional)</Label>
                  <Input
                    value={contribution.notes}
                    onChange={(e) => setContribution({ ...contribution, notes: e.target.value })}
                    placeholder="Payment reference or notes"
                  />
                </div>
                <Button 
                  onClick={handleAddContribution} 
                  disabled={addContribution.isPending || !contribution.amount}
                  className="w-full"
                >
                  {addContribution.isPending ? 'Adding...' : 'Add Contribution'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${balanceColor}`}>
                {balance.toFixed(2)} BDT
              </div>
              {balance < 250 && (
                <div className="flex items-center mt-2 text-sm text-yellow-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Below threshold
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Contact</CardTitle>
              <Phone className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg">
                {member.contact_number || 'Not provided'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Consecutive Absences</CardTitle>
              <CreditCard className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {member.consecutive_absences}
              </div>
              {member.consecutive_absences >= 2 && (
                <Badge variant="destructive" className="mt-2">Fine Applied</Badge>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Member Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium">{new Date(member.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-medium">{new Date(member.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
