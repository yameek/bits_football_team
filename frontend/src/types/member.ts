export interface Member {
  id: number;
  name: string;
  pin?: string;
  contact_number?: string;
  balance: string;
  consecutive_absences: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreateMemberDto {
  name: string;
  contactNumber: string;
  pin?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateMemberDto {
  name?: string;
  contactNumber?: string;
  pin?: string;
  status?: 'active' | 'inactive';
}

export interface ContributionDto {
  amount: number;
  method: 'cash' | 'bank' | 'mobile';
  notes?: string;
  paymentReference?: string;
}
