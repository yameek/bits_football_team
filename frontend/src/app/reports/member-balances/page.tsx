'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMembers } from '@/hooks/useMembers';
import { AlertTriangle } from 'lucide-react';

export default function MemberBalancesReportPage() {
  const { data: members, isLoading } = useMembers();

  if (isLoading) return <MainLayout><div>Loading...</div></MainLayout>;

  const activeMembers = members?.filter(m => m.status === 'active') || [];
  const sortedMembers = [...activeMembers].sort((a, b) => parseFloat(a.balance) - parseFloat(b.balance));

  const inCredit = activeMembers.filter(m => parseFloat(m.balance) > 0);
  const inDebt = activeMembers.filter(m => parseFloat(m.balance) < 0);
  const belowThreshold = activeMembers.filter(m => parseFloat(m.balance) < 250);

  const totalCredit = inCredit.reduce((sum, m) => sum + parseFloat(m.balance), 0);
  const totalDebt = inDebt.reduce((sum, m) => sum + Math.abs(parseFloat(m.balance)), 0);

  const getBalanceColor = (balance: string) => {
    const bal = parseFloat(balance);
    if (bal < 0) return 'text-red-600';
    if (bal < 250) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Member Balances Report</h1>
          <p className="text-gray-600 mt-1">All member balances overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Total Members</p>
            <p className="text-3xl font-bold">{activeMembers.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">In Credit</p>
            <p className="text-3xl font-bold text-green-600">{inCredit.length}</p>
            <p className="text-xs text-gray-600 mt-1">+{totalCredit.toFixed(2)} BDT</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">In Debt</p>
            <p className="text-3xl font-bold text-red-600">{inDebt.length}</p>
            <p className="text-xs text-gray-600 mt-1">-{totalDebt.toFixed(2)} BDT</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Below Threshold</p>
            <p className="text-3xl font-bold text-yellow-600">{belowThreshold.length}</p>
            <p className="text-xs text-gray-600 mt-1">{'<'} 250 BDT</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Members</h2>
          <div className="space-y-2">
            {sortedMembers.map((member) => {
              const balance = parseFloat(member.balance);
              const isBelowThreshold = balance < 250;
              
              return (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{member.name}</span>
                      {member.pin && (
                        <Badge variant="outline" className="text-xs">
                          PIN: {member.pin}
                        </Badge>
                      )}
                      {member.consecutive_absences > 0 && (
                        <Badge variant="outline" className="text-xs text-orange-600">
                          {member.consecutive_absences} absences
                        </Badge>
                      )}
                    </div>
                    {isBelowThreshold && (
                      <div className="flex items-center mt-1 text-xs text-yellow-600">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Below threshold
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getBalanceColor(member.balance)}`}>
                      {balance.toFixed(2)} BDT
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
