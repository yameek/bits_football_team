'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { transactionApi } from '@/lib/api/transactions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';
import { useState } from 'react';

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: transactionApi.getAll,
  });

  const filteredTransactions = transactions?.filter((t: any) => {
    const matchesSearch = t.member?.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || t.transaction_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contribution': return 'bg-green-100 text-green-800';
      case 'session_fee': return 'bg-red-100 text-red-800';
      case 'fine': return 'bg-orange-100 text-orange-800';
      case 'surcharge': return 'bg-purple-100 text-purple-800';
      case 'bulk_payment': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAmountColor = (amount: string) => {
    return parseFloat(amount) >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-gray-600 mt-1">View all financial transactions</p>
          </div>
          <Link href="/transactions/bulk-payment">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Bulk Payment
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by member name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="contribution">Contribution</SelectItem>
              <SelectItem value="session_fee">Session Fee</SelectItem>
              <SelectItem value="fine">Fine</SelectItem>
              <SelectItem value="surcharge">Surcharge</SelectItem>
              <SelectItem value="bulk_payment">Bulk Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div>Loading transactions...</div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions?.map((transaction: any) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Badge className={getTypeColor(transaction.transaction_type)}>
                        {transaction.transaction_type.replace('_', ' ')}
                      </Badge>
                      <span className="font-medium">{transaction.member?.name}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>{new Date(transaction.created_at).toLocaleString()}</span>
                      <Badge variant="outline" className="text-xs">
                        {transaction.method}
                      </Badge>
                    </div>
                    {transaction.notes && (
                      <p className="text-sm text-gray-600 mt-1">{transaction.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getAmountColor(transaction.amount)}`}>
                      {parseFloat(transaction.amount) >= 0 ? '+' : ''}
                      {parseFloat(transaction.amount).toFixed(2)} BDT
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Balance: {parseFloat(transaction.balance_after).toFixed(2)} BDT
                    </p>
                  </div>
                </div>
              </Card>
            ))}
            {filteredTransactions?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No transactions found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
