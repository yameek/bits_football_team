'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useMembers } from '@/hooks/useMembers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '@/lib/api/transactions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, DollarSign } from 'lucide-react';

export default function BulkPaymentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: members } = useMembers();
  const [formData, setFormData] = useState({
    payingMemberId: '',
    beneficiaryIds: [] as number[],
    totalAmount: '',
    splitType: 'equal' as 'equal' | 'custom',
    method: 'cash' as 'cash' | 'bank' | 'mobile',
    notes: '',
  });
  const [customAmounts, setCustomAmounts] = useState<Record<number, string>>({});

  const bulkPayment = useMutation({
    mutationFn: transactionApi.bulkPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      router.push('/transactions');
    },
  });

  const activeMembers = members?.filter(m => m.status === 'active') || [];

  const handleBeneficiaryToggle = (memberId: number) => {
    setFormData(prev => ({
      ...prev,
      beneficiaryIds: prev.beneficiaryIds.includes(memberId)
        ? prev.beneficiaryIds.filter(id => id !== memberId)
        : [...prev.beneficiaryIds, memberId],
    }));
  };

  const calculateAmounts = () => {
    if (formData.splitType === 'equal') {
      const perPerson = parseFloat(formData.totalAmount) / formData.beneficiaryIds.length;
      return formData.beneficiaryIds.map(() => perPerson);
    } else {
      return formData.beneficiaryIds.map(id => parseFloat(customAmounts[id] || '0'));
    }
  };

  const totalCustom = Object.values(customAmounts).reduce((sum, val) => sum + parseFloat(val || '0'), 0);
  const amounts = calculateAmounts();
  const isValid = 
    formData.payingMemberId && 
    formData.beneficiaryIds.length > 0 && 
    parseFloat(formData.totalAmount) > 0 &&
    (formData.splitType === 'equal' || Math.abs(totalCustom - parseFloat(formData.totalAmount)) < 0.01);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bulkPayment.mutateAsync({
        payingMemberId: parseInt(formData.payingMemberId),
        beneficiaryIds: formData.beneficiaryIds,
        amounts,
        method: formData.method,
        splitType: formData.splitType,
        notes: formData.notes,
      });
    } catch (error) {
      console.error('Failed to create bulk payment:', error);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bulk Payment</h1>
          <p className="text-gray-600 mt-1">Record payment for multiple members</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label>Paying Member *</Label>
                <Select 
                  value={formData.payingMemberId} 
                  onValueChange={(v) => setFormData({ ...formData, payingMemberId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select member who is paying" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.name} - {parseFloat(member.balance).toFixed(2)} BDT
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Total Amount (BDT) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  placeholder="1000"
                />
              </div>

              <div>
                <Label>Payment Method</Label>
                <Select 
                  value={formData.method} 
                  onValueChange={(v: any) => setFormData({ ...formData, method: v })}
                >
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
                <Label>Split Type</Label>
                <Select 
                  value={formData.splitType} 
                  onValueChange={(v: 'equal' | 'custom') => setFormData({ ...formData, splitType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equal">Equal Split</SelectItem>
                    <SelectItem value="custom">Custom Amounts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Beneficiary Members *</Label>
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto border rounded-md p-3">
                  {activeMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={formData.beneficiaryIds.includes(member.id)}
                          onCheckedChange={() => handleBeneficiaryToggle(member.id)}
                        />
                        <label className="text-sm">
                          {member.name} ({parseFloat(member.balance).toFixed(2)} BDT)
                        </label>
                      </div>
                      {formData.splitType === 'custom' && formData.beneficiaryIds.includes(member.id) && (
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-32"
                          placeholder="Amount"
                          value={customAmounts[member.id] || ''}
                          onChange={(e) => setCustomAmounts({ ...customAmounts, [member.id]: e.target.value })}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {formData.beneficiaryIds.length > 0 && (
                <Card className="bg-blue-50">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Payment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Amount:</span>
                        <span className="font-bold">{parseFloat(formData.totalAmount || '0').toFixed(2)} BDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Beneficiaries:</span>
                        <span className="font-medium">{formData.beneficiaryIds.length}</span>
                      </div>
                      {formData.splitType === 'equal' && formData.totalAmount && (
                        <div className="flex justify-between">
                          <span>Per Person:</span>
                          <span className="font-medium">
                            {(parseFloat(formData.totalAmount) / formData.beneficiaryIds.length).toFixed(2)} BDT
                          </span>
                        </div>
                      )}
                      {formData.splitType === 'custom' && (
                        <div className="flex justify-between">
                          <span>Custom Total:</span>
                          <span className={`font-medium ${Math.abs(totalCustom - parseFloat(formData.totalAmount)) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                            {totalCustom.toFixed(2)} BDT
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {formData.splitType === 'custom' && Math.abs(totalCustom - parseFloat(formData.totalAmount)) >= 0.01 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Custom amounts must equal total amount. Difference: {Math.abs(totalCustom - parseFloat(formData.totalAmount)).toFixed(2)} BDT
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <Label>Notes (Optional)</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={!isValid || bulkPayment.isPending}
                  className="flex-1"
                >
                  {bulkPayment.isPending ? 'Processing...' : 'Create Bulk Payment'}
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
