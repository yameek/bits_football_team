'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SpendingReportPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Spending by Category</h1>
          <p className="text-gray-600 mt-1">Analyze spending patterns</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Spending Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">This report will show spending breakdown by category.</p>
            <p className="text-sm text-gray-500 mt-2">Feature coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
