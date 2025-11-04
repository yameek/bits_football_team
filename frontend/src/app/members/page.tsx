'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { useMembers } from '@/hooks/useMembers';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

export default function MembersPage() {
  const { data: members, isLoading } = useMembers();
  const [search, setSearch] = useState('');

  const filteredMembers = members?.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.pin?.includes(search)
  );

  const getBalanceColor = (balance: string) => {
    const bal = parseFloat(balance);
    if (bal < 0) return 'text-red-600';
    if (bal < 250) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Members</h1>
            <p className="text-gray-600 mt-1">Manage team members and balances</p>
          </div>
          <Link href="/members/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or PIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div>Loading members...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers?.map((member) => (
              <Link key={member.id} href={`/members/${member.id}`}>
                <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                  </div>
                  {member.pin && (
                    <p className="text-sm text-gray-600 mb-2">PIN: {member.pin}</p>
                  )}
                  <div className="flex justify-between items-center mt-3">
                    <span className={`text-xl font-bold ${getBalanceColor(member.balance)}`}>
                      {parseFloat(member.balance).toFixed(2)} BDT
                    </span>
                    {member.consecutive_absences > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {member.consecutive_absences} absences
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
