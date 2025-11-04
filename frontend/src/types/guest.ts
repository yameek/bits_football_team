export interface Guest {
  id: number;
  name: string;
  contact_number?: string;
  session_id: number;
  brought_by_member_id: number;
  paid_by_member_id?: number;
  amount_paid: string;
  converted_to_member: boolean;
  converted_member_id?: number;
  created_at: string;
}

export interface AddGuestDto {
  name: string;
  contactNumber?: string;
  broughtByMemberId: number;
  paidByMemberId?: number;
  amountPaid?: number;
}

export interface ConvertGuestDto {
  pin: string;
  applyNewMemberSurcharge?: boolean;
}
