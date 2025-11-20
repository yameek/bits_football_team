export interface Session {
  id: number;
  field_id: number;
  session_type: 'practice' | 'match';
  scheduled_date: string;
  field_cost: string;
  transport_cost: string;
  drinks_cost: string;
  emergency_fund: string;
  total_cost: string;
  status: 'planned' | 'in_progress' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
  field?: Field;
}

export interface Field {
  id: number;
  name: string;
  location?: string;
  default_cost?: string;
}

export interface CreateSessionDto {
  fieldId: number;
  sessionType: 'practice' | 'match';
  scheduledStart: string;
  scheduledEnd?: string;
  fieldCost?: number;
  transportCost?: number;
  drinksCost?: number;
  emergencyFund?: number;
  otherCosts?: number;
  notes?: string;
}

export interface Attendance {
  id: number;
  session_id: number;
  member_id: number;
  status: 'present' | 'late' | 'absent';
  charged_amount?: string;
  notes?: string;
  member?: {
    id: number;
    name: string;
    pin?: string;
    balance: string;
  };
}

export interface MarkAttendanceDto {
  memberId: number;
  status: 'present' | 'late' | 'absent';
}
