'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@/lib/api/reports';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function SpendingReportPage() {
  const { data: spendingData, isLoading } = useQuery({
    queryKey: ['reports', 'spending-by-category'],
    queryFn: reportApi.getSpendingByCategory,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Spending by Category</h1>
            <p className="text-gray-600 mt-1">Analyze spending patterns</p>
          </div>
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">Loading spending data...</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const totalSpending = spendingData?.reduce((sum: number, item: any) => sum + (item.totalAmount || 0), 0) || 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Spending by Category</h1>
          <p className="text-gray-600 mt-1">Analyze spending patterns</p>
        </div>

        {spendingData && spendingData.length > 0 ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Spending Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={spendingData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => `${entry.categoryName}: ${entry.percentage?.toFixed(1) || 0}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="totalAmount"
                      >
                        {spendingData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)} BDT`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-semibold">Total Spending</span>
                    <span className="font-bold text-lg">{totalSpending.toFixed(2)} BDT</span>
                  </div>
                  {spendingData.map((item: any, index: number) => (
                    <div key={item.categoryId || index} className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <p className="font-medium">{item.categoryName}</p>
                          <p className="text-sm text-gray-500">
                            {item.transactionCount} transaction{item.transactionCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{Math.abs(item.totalAmount).toFixed(2)} BDT</p>
                        <p className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Spending Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No spending data available yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
