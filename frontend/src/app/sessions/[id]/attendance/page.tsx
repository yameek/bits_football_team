'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { useSession, useSessionAttendance, useMarkAttendance } from '@/hooks/useSessions';
import { useMembers } from '@/hooks/useMembers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Search, Check, Clock, X, AlertTriangle } from 'lucide-react';

export default function AttendancePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = parseInt(params.id as string);
  const { data: session, isLoading: sessionLoading } = useSession(sessionId);
  const { data: members, isLoading: membersLoading } = useMembers();
  const { data: existingAttendance } = useSessionAttendance(sessionId);
  const markAttendance = useMarkAttendance();

  const [search, setSearch] = useState('');
  const [attendanceMap, setAttendanceMap] = useState<Record<number, 'present' | 'late' | 'absent'>>({});
  const [isSaving, setIsSaving] = useState(false);

  useMemo(() => {
    if (existingAttendance && existingAttendance.length > 0) {
      const map: Record<number, 'present' | 'late' | 'absent'> = {};
      existingAttendance.forEach((att: any) => {
        map[att.member_id] = att.status;
      });
      setAttendanceMap(map);
    }
  }, [existingAttendance]);

  const activeMembers = members?.filter(m => m.status === 'active') || [];
  
  const filteredMembers = activeMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.pin?.includes(search)
  );

  const handleStatusChange = (memberId: number, status: 'present' | 'late' | 'absent') => {
    setAttendanceMap(prev => ({ ...prev, [memberId]: status }));
  };

  const handleMarkAllPresent = () => {
    const map: Record<number, 'present' | 'late' | 'absent'> = {};
    activeMembers.forEach(m => {
      map[m.id] = 'present';
    });
    setAttendanceMap(map);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const attendances = Object.entries(attendanceMap).map(([memberId, status]) => ({
        memberId: parseInt(memberId),
        status,
      }));
      
      await markAttendance.mutateAsync({
        id: sessionId,
        data: attendances,
      });
      
      router.push(`/sessions/${sessionId}`);
    } catch (error) {
      console.error('Failed to save attendance:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const summary = useMemo(() => {
    const present = Object.values(attendanceMap).filter(s => s === 'present').length;
    const late = Object.values(attendanceMap).filter(s => s === 'late').length;
    const absent = Object.values(attendanceMap).filter(s => s === 'absent').length;
    return { present, late, absent };
  }, [attendanceMap]);

  if (sessionLoading || membersLoading) {
    return <MainLayout><div>Loading...</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mark Attendance</h1>
          <p className="text-gray-600 mt-1">
            {session?.session_type} - {new Date(session?.scheduled_date || '').toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or PIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleMarkAllPresent} variant="outline">
            Mark All Present
          </Button>
        </div>

        <Card className="p-4">
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-600 mr-1" />
              <span>Present: {summary.present}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-yellow-600 mr-1" />
              <span>Late: {summary.late}</span>
            </div>
            <div className="flex items-center">
              <X className="h-4 w-4 text-red-600 mr-1" />
              <span>Absent: {summary.absent}</span>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          {filteredMembers.map((member) => {
            const status = attendanceMap[member.id];
            const balance = parseFloat(member.balance);
            const willBeLowBalance = balance < 250;
            const consecutiveAbsence = member.consecutive_absences >= 1;

            return (
              <Card key={member.id} className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between md:justify-start gap-3">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      {member.pin && (
                        <Badge variant="outline" className="text-xs">
                          PIN: {member.pin}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>Balance: {balance.toFixed(2)} BDT</span>
                      {consecutiveAbsence && (
                        <span className="flex items-center text-orange-600">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {member.consecutive_absences} consecutive absence(s)
                        </span>
                      )}
                    </div>
                    {willBeLowBalance && (
                      <Alert className="mt-2 py-2">
                        <AlertDescription className="text-xs">
                          Warning: Member will be below 250 BDT threshold
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={status === 'present' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(member.id, 'present')}
                      className={status === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      <Check className="h-4 w-4 md:mr-1" />
                      <span className="hidden md:inline">Present</span>
                    </Button>
                    <Button
                      size="sm"
                      variant={status === 'late' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(member.id, 'late')}
                      className={status === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                    >
                      <Clock className="h-4 w-4 md:mr-1" />
                      <span className="hidden md:inline">Late</span>
                    </Button>
                    <Button
                      size="sm"
                      variant={status === 'absent' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(member.id, 'absent')}
                      className={status === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                      <X className="h-4 w-4 md:mr-1" />
                      <span className="hidden md:inline">Absent</span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
          <Button 
            onClick={handleSave} 
            disabled={isSaving || Object.keys(attendanceMap).length === 0}
            className="flex-1"
            size="lg"
          >
            {isSaving ? 'Saving...' : 'Save Attendance'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            size="lg"
          >
            Cancel
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
