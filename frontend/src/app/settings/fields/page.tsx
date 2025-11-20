'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

export default function FieldsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingField, setEditingField] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    googleMapLink: '',
  });

  const { data: fields, isLoading } = useQuery({
    queryKey: ['fields'],
    queryFn: async () => {
      const { data } = await api.get('/fields');
      return data;
    },
  });

  const createField = useMutation({
    mutationFn: async (data: any) => {
      const { data: result } = await api.post('/fields', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      setOpen(false);
      setFormData({ name: '', address: '', googleMapLink: '' });
    },
  });

  const updateField = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const { data: result } = await api.patch(`/fields/${id}`, data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      setOpen(false);
      setEditingField(null);
      setFormData({ name: '', address: '', googleMapLink: '' });
    },
  });

  const deleteField = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/fields/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
    },
  });

  const handleSubmit = () => {
    const fieldData: any = {
      name: formData.name,
    };
    
    if (formData.address) {
      fieldData.address = formData.address;
    }
    
    if (formData.googleMapLink) {
      fieldData.googleMapLink = formData.googleMapLink;
    }
    
    if (editingField) {
      updateField.mutate({
        id: editingField.id,
        data: fieldData,
      });
    } else {
      createField.mutate(fieldData);
    }
  };

  const handleEdit = (field: any) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      address: field.address || '',
      googleMapLink: field.google_map_link || '',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingField(null);
    setFormData({ name: '', address: '', googleMapLink: '' });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Fields Management</h1>
            <p className="text-gray-600 mt-1">Manage football field locations</p>
          </div>
          <Dialog open={open} onOpenChange={handleClose}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingField ? 'Edit Field' : 'Add New Field'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Field Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Central Stadium"
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g., 123 Main Street, Dhaka, Bangladesh"
                  />
                </div>
                <div>
                  <Label>Google Maps Link (Optional)</Label>
                  <Input
                    type="url"
                    value={formData.googleMapLink}
                    onChange={(e) => setFormData({ ...formData, googleMapLink: e.target.value })}
                    placeholder="https://maps.google.com/?q=..."
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.name || createField.isPending || updateField.isPending}
                  className="w-full"
                >
                  {createField.isPending || updateField.isPending
                    ? 'Saving...'
                    : editingField
                    ? 'Update Field'
                    : 'Add Field'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div>Loading fields...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields?.map((field: any) => (
              <Card key={field.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{field.name}</span>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(field)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this field?')) {
                            deleteField.mutate(field.id);
                          }
                        }}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {field.address && (
                    <p className="text-sm text-gray-600 mb-2">{field.address}</p>
                  )}
                  {field.google_map_link && (
                    <a
                      href={field.google_map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View on Google Maps
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
            {fields?.length === 0 && (
              <Card className="col-span-full p-12 text-center">
                <p className="text-gray-600">No fields found. Add your first field!</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
