'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@/lib/api/reports';
import { BarChart3, DollarSign, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const { data: teamBalance } = useQuery({
    queryKey: ['reports', 'team-balance'],
    queryFn: reportApi.getTeamBalance,
  });

  const { data: memberBalances } = useQuery({
    queryKey: ['reports', 'member-balances'],
    queryFn: reportApi.getMemberBalances,
  });

  const reports = [
    {
      title: 'Team Balance Report',
      description: 'View team treasury balance and financial breakdown',
      icon: <DollarSign className="h-8 w-8" />,
      href: '/reports/team-balance',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Member Balances',
      description: 'See all member balances and identify who owes money',
      icon: <Users className="h-8 w-8" />,
      href: '/reports/member-balances',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Spending by Category',
      description: 'Analyze spending patterns by category',
      icon: <BarChart3 className="h-8 w-8" />,
      href: '/reports/spending',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Session Costs',
      description: 'View session cost analysis and trends',
      icon: <TrendingUp className="h-8 w-8" />,
      href: '/reports/session-costs',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Attendance Summary',
      description: 'Member attendance statistics and patterns',
      icon: <Users className="h-8 w-8" />,
      href: '/reports/attendance',
      color: 'bg-pink-100 text-pink-600',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Financial and operational reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Current Team Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {teamBalance?.current_balance ? parseFloat(teamBalance.current_balance).toFixed(2) : '0.00'} BDT
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Members
              </CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {memberBalances?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Link key={report.href} href={report.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className={`w-16 h-16 rounded-lg ${report.color} flex items-center justify-center mb-4`}>
                    {report.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{report.title}</h3>
                  <p className="text-gray-600 text-sm">{report.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
