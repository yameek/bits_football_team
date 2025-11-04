'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateMember } from '@/hooks/useMembers';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export default function NewMemberPage() {
  const router = useRouter();
  const createMember = useCreateMember();
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    pin: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createMember.mutateAsync(formData);
      router.push(`/members/${result.id}`);
    } catch (error) {
      console.error('Failed to create member:', error);
    }
  };

  const generatePin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setFormData({ ...formData, pin });
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Member</h1>
          <p className="text-gray-600 mt-1">Register a new team member</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            New members will automatically be charged a 500 BDT surcharge and start with a balance of -500 BDT
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Member Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  required
                  minLength={2}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter member name"
                />
              </div>

              <div>
                <Label htmlFor="contact">Contact Number *</Label>
                <Input
                  id="contact"
                  required
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="+8801712345678"
                />
              </div>

              <div>
                <Label htmlFor="pin">PIN (4-6 digits)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="pin"
                    maxLength={6}
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                    placeholder="1234"
                  />
                  <Button type="button" variant="outline" onClick={generatePin}>
                    Generate
                  </Button>
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                <Button 
                  type="submit" 
                  disabled={createMember.isPending}
                  className="flex-1"
                >
                  {createMember.isPending ? 'Creating...' : 'Create Member'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>

              {createMember.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Failed to create member. Please try again.
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
