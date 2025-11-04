'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings');
      return data;
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data } = await api.put(`/settings/${key}`, { value });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setEditingKey(null);
      setSuccessMessage(`Updated ${variables.key} successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    },
  });

  const handleEdit = (key: string, currentValue: string) => {
    setEditingKey(key);
    setTempValue(currentValue);
  };

  const handleSave = (key: string) => {
    updateSetting.mutate({ key, value: tempValue });
  };

  const settingGroups = {
    'Financial Thresholds': [
      'treasury_min_threshold',
      'member_min_threshold',
    ],
    'Fine Settings': [
      'fine_percentage',
      'consecutive_absence_limit',
    ],
    'New Member Settings': [
      'surcharge_amount',
      'new_member_period_days',
    ],
    'General': [
      'currency',
      'rounding_increment',
    ],
  };

  const getSettingLabel = (key: string) => {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (isLoading) return <MainLayout><div>Loading...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-1">Configure system parameters</p>
        </div>

        {successMessage && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {Object.entries(settingGroups).map(([groupName, keys]) => (
          <Card key={groupName}>
            <CardHeader>
              <CardTitle>{groupName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {keys.map((key) => {
                const setting = settings?.find((s: any) => s.key === key);
                if (!setting) return null;

                const isEditing = editingKey === key;

                return (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">{getSettingLabel(key)}</Label>
                      {setting.description && (
                        <p className="text-xs text-gray-600 mt-1">{setting.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {isEditing ? (
                        <>
                          <Input
                            type="number"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="w-32"
                          />
                          <Button size="sm" onClick={() => handleSave(key)} disabled={updateSetting.isPending}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingKey(null)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-lg font-semibold min-w-[100px] text-right">
                            {setting.value}
                          </span>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(key, setting.value)}>
                            Edit
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}
