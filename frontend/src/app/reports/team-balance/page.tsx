'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@/lib/api/reports';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

export default function TeamBalanceReportPage() {
  const { data: teamBalance, isLoading } = useQuery({
    queryKey: ['reports', 'team-balance'],
    queryFn: reportApi.getTeamBalance,
  });

  if (isLoading) return <MainLayout><div>Loading...</div></MainLayout>;

  const currentBalance = parseFloat(teamBalance?.current_balance || '0');
  const isLowBalance = currentBalance < 5000;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Team Balance Report</h1>
          <p className="text-gray-600 mt-1">Treasury financial overview</p>
        </div>

        <Card className={isLowBalance ? 'border-red-300' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Team Balance</span>
              {isLowBalance && (
                <span className="text-red-600 text-sm font-normal">Below 5000 BDT threshold</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-5xl font-bold ${isLowBalance ? 'text-red-600' : 'text-green-600'}`}>
              {currentBalance.toFixed(2)} BDT
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Collected
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {teamBalance?.total_collected ? parseFloat(teamBalance.total_collected).toFixed(2) : '0.00'} BDT
              </div>
              <p className="text-xs text-gray-600 mt-1">All-time contributions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Spent
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {teamBalance?.total_spent ? parseFloat(teamBalance.total_spent).toFixed(2) : '0.00'} BDT
              </div>
              <p className="text-xs text-gray-600 mt-1">Session fees & expenses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Net Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(parseFloat(teamBalance?.total_collected || '0') - parseFloat(teamBalance?.total_spent || '0')).toFixed(2)} BDT
              </div>
              <p className="text-xs text-gray-600 mt-1">Collected - Spent</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Financial Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                <span className="font-medium">Contributions</span>
                <span className="text-lg font-bold text-green-600">
                  +{teamBalance?.total_collected ? parseFloat(teamBalance.total_collected).toFixed(2) : '0.00'} BDT
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                <span className="font-medium">Session Fees</span>
                <span className="text-lg font-bold text-red-600">
                  -{teamBalance?.total_spent ? parseFloat(teamBalance.total_spent).toFixed(2) : '0.00'} BDT
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
